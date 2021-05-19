 package.path = '/usr/local/openresty/nginx/lua/?.lua;/usr/local/openresty/nginx/lua/lib/?.lua;'
 package.cpath = '/usr/local/openresty/nginx/lua/?.so;/usr/local//openresty/nginx/lua/lib/?.so;'

ip_bind_time = 10  --IP限制访问时间: 10秒
-- ip访问统计时间段：2小时
ip_time_out = 7200
-- ip访问计数最大值
connect_count = 1000
-- 2小时内达到1000次就ban

-- 连接redis
local redis = require 'resty.redis'
local cache = redis.new()
local ok ,err = cache.connect(cache,'127.0.0.1','6379')
cache:set_timeout(60000)
-- 如果连接失败，跳转到label处（脚本末尾）
if not ok then
  goto label
end

-- 白名单
is_white ,err = cache:sismember('white_list', ngx.var.remote_addr)
if is_white == 1 then
  goto label
end

-- 查询ip是否在限制时间段内
is_ban , err = cache:get('ban:' .. ngx.var.remote_addr) 
-- 如果被限制则可以设置验证，不设则直接限制访问10s
if tonumber(is_ban) == 1 then
  -- source携带了之前用户请求的地址信息，方便之后返回原用户请求地址
  local source = ngx.encode_base64(ngx.var.scheme .. '://' ..
    ngx.var.host .. ':' .. ngx.var.server_port .. ngx.var.request_uri)

  -- dest可以设置为验证码
  -- local dest = 'http://127.0.0.1:5000/' .. '?continue=' .. source 
  -- ngx.redirect(dest,302)
  goto label
end

-- ip记录周期开始时间
start_time , err = cache:get('time:' .. ngx.var.remote_addr)
-- ip周期内访问计数
ip_count , err = cache:get('count:' .. ngx.var.remote_addr)

-- 如果ip记录周期不存在或者进入新的记录周期，则重置记录周期开始时间和访问计数
if start_time == ngx.null or os.time() - tonumber(start_time) > ip_time_out then
  res , err = cache:set('time:' .. ngx.var.remote_addr , os.time())
  res , err = cache:set('count:' .. ngx.var.remote_addr , 1)
-- 如果处于当前记录周期内，则ip访问计数+1，
else
    ip_count = ip_count + 1
  res , err = cache:incr('count:' .. ngx.var.remote_addr)
  -- 如果ip计数大于指定ip访问频率上限，则设置ip限制ban为1，同时设置ban的过期时间为ip限制时间之后
  if ip_count >= connect_count then
    res , err = cache:set('ban:' .. ngx.var.remote_addr , 1)
    res , err = cache:expire('ban:' .. ngx.var.remote_addr , ip_ban_time)
   
  end
end

::label::
local ok , err = cache:close()
package yifan.j.springmaven.controller;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//@ConfigurationProperties(prefix=)
@RestController
public class Hello {
    @RequestMapping("/hello")

    public String handle() {
        return "Hello World!";
    }

    @RequestMapping("/a")

    public String a() {
        return "a";
    }
}

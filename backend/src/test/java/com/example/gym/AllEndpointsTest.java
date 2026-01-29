package com.example.gym;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class AllEndpointsTest {

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;

    @Autowired
    private RequestMappingHandlerMapping mapping;

    @BeforeEach
    void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    @Test
    void callAllMappedEndpoints_no5xxResponses() throws Exception {
        Map<RequestMappingInfo, HandlerMethod> handlerMethods = mapping.getHandlerMethods();
        List<String> failures = new ArrayList<>();

        for (Map.Entry<RequestMappingInfo, HandlerMethod> entry : handlerMethods.entrySet()) {
            RequestMappingInfo info = entry.getKey();
            Set<String> patterns = info.getPatternsCondition().getPatterns();
            Set<RequestMethod> methods = info.getMethodsCondition().getMethods();

            RequestMethod methodToUse = methods.isEmpty() ? RequestMethod.GET : methods.iterator().next();

            for (String rawPattern : patterns) {
                String uri = rawPattern.replaceAll("\\{[^}]+}([:^}]+)?", "1");

                MockHttpServletRequestBuilder builder;
                switch (methodToUse) {
                    case POST:
                        builder = MockMvcRequestBuilders.post(uri)
                                .content("{}")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON);
                        break;
                    case PUT:
                        builder = MockMvcRequestBuilders.put(uri)
                                .content("{}")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON);
                        break;
                    case PATCH:
                        builder = MockMvcRequestBuilders.patch(uri)
                                .content("{}")
                                .contentType(MediaType.APPLICATION_JSON)
                                .accept(MediaType.APPLICATION_JSON);
                        break;
                    case DELETE:
                        builder = MockMvcRequestBuilders.delete(uri)
                                .accept(MediaType.APPLICATION_JSON);
                        break;
                    case HEAD:
                        builder = MockMvcRequestBuilders.head(uri)
                                .accept(MediaType.APPLICATION_JSON);
                        break;
                    case OPTIONS:
                        builder = MockMvcRequestBuilders.options(uri)
                                .accept(MediaType.APPLICATION_JSON);
                        break;
                    case GET:
                    default:
                        builder = MockMvcRequestBuilders.get(uri)
                                .accept(MediaType.APPLICATION_JSON);
                        break;
                }

                try {
                    int status = mockMvc.perform(builder).andReturn().getResponse().getStatus();
                    System.out.println(methodToUse + " " + uri + " -> " + status);
                    if (status >= 500) {
                        failures.add(methodToUse + " " + uri + " -> " + status);
                    }
                } catch (Exception ex) {
                    failures.add(methodToUse + " " + uri + " -> exception: " + ex.getMessage());
                }
            }
        }

        assertTrue(failures.isEmpty(), "Found endpoints with 5xx or exceptions: " + failures);
    }
}

package com.coursecontentupload.task.controller;

import com.coursecontentupload.task.model.Course_Content;
import com.coursecontentupload.task.service.CourseContentServices;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CourseContentController {
    private final CourseContentServices services;

    public CourseContentController(CourseContentServices services){
        this.services=services;
    }

    @PostMapping("/api/upload")
    public Course_Content uploadCourseFile(@RequestParam("file")MultipartFile file) throws IOException{
        return services.saveFile(file);
    }

    @GetMapping("/api/files")
    public List<Course_Content> allFiles(){
        return services.getAllFiles();
    }

    @GetMapping("/api/downloadfile/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long id) throws IOException{
        byte[] data = services.getFile(id);
        Course_Content content=services.getMetaData(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(content.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\"" + content.getFileName()+"\"")
                .body(data);
    }

}

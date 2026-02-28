package com.coursecontentupload.task.service;

import com.coursecontentupload.task.model.Course_Content;
import com.coursecontentupload.task.repository.CourseContentRepository;
import org.hibernate.annotations.SecondaryRow;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;

@Service
public class CourseContentServices {
    private final CourseContentRepository repository;
    private final String uploadDir = "uploads";

    public CourseContentServices(CourseContentRepository repository){
        this.repository=repository;
    }

    public Course_Content saveFile(MultipartFile file) throws IOException{
        String type=file.getContentType();
        if(!type.equals("application/pdf") && !type.startsWith("image/") && !type.equals("video/mp4")){
            throw new RuntimeException(("Invalid file type"));
        }
        if(file.getSize()>50 *1024*1024){
            throw new RuntimeException("File too large");
        }
        Files.createDirectories(Paths.get(uploadDir));

        // Save file locally
        Path filePath = Paths.get(uploadDir, file.getOriginalFilename());
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Save metadata
        Course_Content content = new Course_Content();
        content.setFileName(file.getOriginalFilename());
        content.setFileType(type);
        content.setFileSize(file.getSize());
        content.setFileUrl(filePath.toAbsolutePath().toString());

        return repository.save(content);
    }
    public byte[] getFile(Long id) throws IOException {
        Course_Content content = getMetaData(id);

        Path filePath = Paths.get(content.getFileUrl());
        if (!Files.exists(filePath)) {
            throw new RuntimeException("File not found on server");
        }
        return Files.readAllBytes(filePath);
    }
    public List<Course_Content> getAllFiles() {
        return repository.findAll();

    }
    public Course_Content getMetaData(Long id){
        return repository.findById(id).orElseThrow(()-> new RuntimeException("File metadata not found"));
    }

}

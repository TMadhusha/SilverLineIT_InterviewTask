package com.coursecontentupload.task.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "course_content")
@Data
public class Course_Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name",nullable = false)
    private String fileName;
    @Column(name = "file_type",nullable = false)
    private String fileType;
    @Column(name = "file_size",nullable = false)
    private Long fileSize;
    @Column(name = "upload_date")
    private LocalDateTime uploadDate;
    @Column(name = "file_url",nullable = false)
    private String fileUrl;

    @PrePersist
    protected void onCreate(){
        this.uploadDate=LocalDateTime.now();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
}

package com.coursecontentupload.task.repository;

import com.coursecontentupload.task.model.Course_Content;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseContentRepository
        extends JpaRepository<Course_Content,Long> {
}

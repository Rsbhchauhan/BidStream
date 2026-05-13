package com.bidstream.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStorageService {
    /**
     * Uploads an image and returns the URL to access it.
     * @param file the image file to upload
     * @return the URL of the stored image
     */
    String uploadImage(MultipartFile file);
}

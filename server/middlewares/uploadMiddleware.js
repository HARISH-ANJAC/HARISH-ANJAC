

/*
// Upload a file
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title } = req.body; // Extract title from the request body
    const fileData = req.file; // Extract file metadata from multer

    console.log(title);
    console.log(fileData);
    
    
    if (!fileData) {
      return res.status(400).json({ message: 'File is required' });
    }

    // Store file details in MongoDB
    const fileDetails = await uploadModel.create({
      title,
      pdf: {
        originalName: fileData.originalname,
        mimeType: fileData.mimetype,
        size: fileData.size,
        path: fileData.path,
      },
    });

    res.status(201).json({ message: 'File uploaded successfully', fileDetails });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error });
  }
});
*/
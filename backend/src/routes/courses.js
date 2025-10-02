import express from 'express';
import { createTusUpload } from '../services/vimeoClient.js';
import { getCourseById, saveCourseVideoUrl } from '../repositories/courseRepository.js';

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await getCourseById(id);

    if (!course) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    return res.json(course);
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/upload-video', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fileName, fileSize, privacyView, redirectUrl } = req.body;

    if (!fileName) {
      return res.status(400).json({ message: 'fileName é obrigatório' });
    }

    if (!fileSize || Number.isNaN(Number(fileSize))) {
      return res.status(400).json({ message: 'fileSize é obrigatório e deve ser numérico' });
    }

    const course = await getCourseById(id);

    if (!course) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    const uploadResponse = await createTusUpload({
      name: fileName,
      size: Number(fileSize),
      privacyView,
      redirectUrl,
    });

    const uploadLink = uploadResponse?.upload?.upload_link;
    const vimeoResourceUri = uploadResponse?.uri;
    const videoUrl = uploadResponse?.link;

    if (!uploadLink || !vimeoResourceUri) {
      return res.status(502).json({ message: 'Não foi possível gerar link de upload seguro com o Vimeo' });
    }

    const updatedCourse = await saveCourseVideoUrl(id, {
      videoUrl,
      vimeoResourceUri,
    });

    return res.status(201).json({
      uploadLink,
      course: updatedCourse,
      video: {
        resourceUri: vimeoResourceUri,
        url: videoUrl,
        embedUrl: videoUrl ? videoUrl.replace('vimeo.com/', 'player.vimeo.com/video/') : null,
      },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;

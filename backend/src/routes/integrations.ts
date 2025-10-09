import { Router } from 'express';
import {
  LiveMentoringDuplicateRegistrationError,
  LiveMentoringSessionFullError,
  LiveMentoringSessionNotFoundError,
  liveMentoringIntegrationService,
} from '../services/liveMentoringIntegrationService';

export const router = Router();

router.get('/live-mentoring', (_req, res) => {
  const overview = liveMentoringIntegrationService.getOverview();
  res.json(overview);
});

router.post('/live-mentoring/sessions/:sessionId/register', (req, res) => {
  const { sessionId } = req.params;
  const { name, email, professionalId } = req.body ?? {};

  if (typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ message: 'The "name" field is required.' });
    return;
  }

  if (typeof email !== 'string' || email.trim() === '') {
    res.status(400).json({ message: 'The "email" field is required.' });
    return;
  }

  const trimmedEmail = email.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(trimmedEmail)) {
    res.status(400).json({ message: 'Please provide a valid email address.' });
    return;
  }

  const sanitizedProfessionalId =
    typeof professionalId === 'string' && professionalId.trim() !== '' ? professionalId.trim() : undefined;

  try {
    const { registration, session } = liveMentoringIntegrationService.registerParticipant({
      sessionId,
      participantName: name.trim(),
      participantEmail: trimmedEmail,
      professionalId: sanitizedProfessionalId,
    });

    res.status(201).json({
      registration: {
        id: registration.id,
        sessionId: registration.sessionId,
        participantName: registration.participantName,
        participantEmail: registration.participantEmail,
        professionalId: registration.professionalId,
        registeredAt: registration.registeredAt,
        joinUrl: session.meetingUrl,
        mentor: session.mentor,
        topic: session.topic,
        startAt: session.startAt,
      },
    });
  } catch (error) {
    if (error instanceof LiveMentoringSessionNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }

    if (error instanceof LiveMentoringDuplicateRegistrationError) {
      res.status(409).json({ message: error.message });
      return;
    }

    if (error instanceof LiveMentoringSessionFullError) {
      res.status(409).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Unable to process registration at this time.' });
  }
});

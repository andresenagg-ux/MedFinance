import { randomUUID } from 'crypto';

type IntegrationDetails = {
  provider: string;
  description: string;
  documentationUrl: string;
  supportEmail: string;
  contactChannel: string;
};

type LiveMentoringSession = {
  id: string;
  topic: string;
  mentor: string;
  startAt: string;
  durationMinutes: number;
  meetingUrl: string;
  capacity: number;
};

type RegistrationInput = {
  sessionId: string;
  participantName: string;
  participantEmail: string;
  professionalId?: string;
};

type Registration = {
  id: string;
  sessionId: string;
  participantName: string;
  participantEmail: string;
  professionalId?: string;
  registeredAt: string;
};

export class LiveMentoringSessionNotFoundError extends Error {
  constructor() {
    super('Live mentoring session not found.');
    this.name = 'LiveMentoringSessionNotFoundError';
  }
}

export class LiveMentoringDuplicateRegistrationError extends Error {
  constructor() {
    super('Participant already registered for this session.');
    this.name = 'LiveMentoringDuplicateRegistrationError';
  }
}

export class LiveMentoringSessionFullError extends Error {
  constructor() {
    super('The selected session has no available spots.');
    this.name = 'LiveMentoringSessionFullError';
  }
}

type OverviewSession = LiveMentoringSession & {
  availableSpots: number;
};

type IntegrationOverview = {
  integration: IntegrationDetails;
  sessions: OverviewSession[];
};

class LiveMentoringIntegrationService {
  private readonly integration: IntegrationDetails = {
    provider: 'MedFinance Mentoria Ao Vivo',
    description:
      'Integração responsável por sincronizar os encontros ao vivo da mentoria financeira com parceiros e hubs educacionais.',
    documentationUrl: 'https://docs.medfinance.com/integrations/live-mentoring',
    supportEmail: 'mentorias@medfinance.com',
    contactChannel: 'https://medfinance.com/suporte/mentorias',
  };

  private readonly sessions: LiveMentoringSession[] = [
    {
      id: 'sess-001',
      topic: 'Fluxo de caixa e capital de giro para clínicas',
      mentor: 'Dra. Ana Souza',
      startAt: '2024-08-05T22:00:00.000Z',
      durationMinutes: 60,
      meetingUrl: 'https://meet.medfinance.com/live/sess-001',
      capacity: 25,
    },
    {
      id: 'sess-002',
      topic: 'Precificação de procedimentos e pacotes recorrentes',
      mentor: 'Dr. Bruno Lima',
      startAt: '2024-08-19T22:00:00.000Z',
      durationMinutes: 60,
      meetingUrl: 'https://meet.medfinance.com/live/sess-002',
      capacity: 25,
    },
    {
      id: 'sess-003',
      topic: 'Estratégias de marketing financeiro e retenção de pacientes',
      mentor: 'Dra. Carla Menezes',
      startAt: '2024-09-02T22:00:00.000Z',
      durationMinutes: 60,
      meetingUrl: 'https://meet.medfinance.com/live/sess-003',
      capacity: 20,
    },
  ];

  private registrations: Registration[] = [];

  getOverview(): IntegrationOverview {
    const sessions = this.sessions.map<OverviewSession>((session) => ({
      ...session,
      availableSpots: this.calculateAvailableSpots(session.id),
    }));

    return {
      integration: this.integration,
      sessions,
    };
  }

  registerParticipant(input: RegistrationInput) {
    const session = this.sessions.find((item) => item.id === input.sessionId);

    if (!session) {
      throw new LiveMentoringSessionNotFoundError();
    }

    const normalizedEmail = input.participantEmail.trim().toLowerCase();

    const alreadyRegistered = this.registrations.some(
      (registration) =>
        registration.sessionId === input.sessionId && registration.participantEmail === normalizedEmail,
    );

    if (alreadyRegistered) {
      throw new LiveMentoringDuplicateRegistrationError();
    }

    const availableSpots = this.calculateAvailableSpots(session.id);

    if (availableSpots <= 0) {
      throw new LiveMentoringSessionFullError();
    }

    const registration: Registration = {
      id: randomUUID(),
      sessionId: session.id,
      participantName: input.participantName.trim(),
      participantEmail: normalizedEmail,
      professionalId: input.professionalId,
      registeredAt: new Date().toISOString(),
    };

    this.registrations = [...this.registrations, registration];

    return {
      registration,
      session,
    };
  }

  clearRegistrations() {
    this.registrations = [];
  }

  private calculateAvailableSpots(sessionId: string): number {
    const session = this.sessions.find((item) => item.id === sessionId);

    if (!session) {
      return 0;
    }

    const registrationsForSession = this.registrations.filter((registration) => registration.sessionId === sessionId);

    return Math.max(session.capacity - registrationsForSession.length, 0);
  }
}

export const liveMentoringIntegrationService = new LiveMentoringIntegrationService();

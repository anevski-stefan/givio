export interface QuizOption {
    id: string;
    title: string;
    subtitle: string;
    icon: QuizIconType;
}

export interface QuizQuestion {
    id: string;
    questionNumber: number;
    title: string;
    hint: string;
    options: QuizOption[];
}

export interface QuizStep {
    id: string;
    stepNumber: number;
    totalSteps: number;
    title: string;
    description: string;
    questions: QuizQuestion[];
}

export type QuizIconType =
    | 'outdoorsy'
    | 'cozy'
    | 'both'
    | 'practical'
    | 'sentimental'
    | 'experience'
    | 'luxury'
    | 'budget'
    | 'surprise'
    | 'wishlist'
    | 'tech'
    | 'handmade'
    | 'wellness'
    | 'food'
    | 'fashion';

export interface QuizAnswers {
    [questionId: string]: string;
}

export interface QuizState {
    currentStep: number;
    currentQuestionIndex: number;
    answers: QuizAnswers;
    isComplete: boolean;
}

export const QUIZ_DATA: QuizStep[] = [
    {
        id: 'step-1',
        stepNumber: 1,
        totalSteps: 5,
        title: 'Get to know their vibe',
        description: 'Answer a few quick questions so Givio can tailor spot-on gift ideas.',
        questions: [
            {
                id: 'q1-vibe',
                questionNumber: 1,
                title: 'More outdoorsy or cozy?',
                hint: 'Think about where they feel most themselves.',
                options: [
                    {
                        id: 'outdoorsy',
                        title: 'Outdoorsy explorer',
                        subtitle: 'Hikes, travel, new experiences',
                        icon: 'outdoorsy',
                    },
                    {
                        id: 'cozy',
                        title: 'Cozy homebody',
                        subtitle: 'Books, candles, nights in',
                        icon: 'cozy',
                    },
                    {
                        id: 'both',
                        title: 'A bit of both',
                        subtitle: 'Depends on their mood',
                        icon: 'both',
                    },
                ],
            },
        ],
    },
    {
        id: 'step-2',
        stepNumber: 2,
        totalSteps: 5,
        title: 'Their gift style',
        description: 'Understanding what kind of gifts resonate with them.',
        questions: [
            {
                id: 'q2-style',
                questionNumber: 2,
                title: 'Practical or sentimental?',
                hint: 'What type of gifts do they appreciate most?',
                options: [
                    {
                        id: 'practical',
                        title: 'Practical & useful',
                        subtitle: 'Things they\'ll use daily',
                        icon: 'practical',
                    },
                    {
                        id: 'sentimental',
                        title: 'Sentimental & meaningful',
                        subtitle: 'Personalized, heartfelt gifts',
                        icon: 'sentimental',
                    },
                    {
                        id: 'experience',
                        title: 'Experiences over things',
                        subtitle: 'Memories matter most',
                        icon: 'experience',
                    },
                ],
            },
        ],
    },
    {
        id: 'step-3',
        stepNumber: 3,
        totalSteps: 5,
        title: 'Budget comfort',
        description: 'Help us find gifts in the right price range.',
        questions: [
            {
                id: 'q3-budget',
                questionNumber: 3,
                title: 'What\'s your budget range?',
                hint: 'We\'ll show options that fit comfortably.',
                options: [
                    {
                        id: 'budget-friendly',
                        title: 'Budget-friendly',
                        subtitle: 'Under $50',
                        icon: 'budget',
                    },
                    {
                        id: 'mid-range',
                        title: 'Mid-range',
                        subtitle: '$50 - $150',
                        icon: 'practical',
                    },
                    {
                        id: 'luxury',
                        title: 'Go all out',
                        subtitle: '$150+',
                        icon: 'luxury',
                    },
                ],
            },
        ],
    },
    {
        id: 'step-4',
        stepNumber: 4,
        totalSteps: 5,
        title: 'Surprise factor',
        description: 'How do they feel about surprises?',
        questions: [
            {
                id: 'q4-surprise',
                questionNumber: 4,
                title: 'Surprise or wishlist?',
                hint: 'Some love surprises, others prefer what they asked for.',
                options: [
                    {
                        id: 'surprise',
                        title: 'Love surprises',
                        subtitle: 'Delight them unexpectedly',
                        icon: 'surprise',
                    },
                    {
                        id: 'wishlist',
                        title: 'Stick to wishlist',
                        subtitle: 'Get exactly what they want',
                        icon: 'wishlist',
                    },
                    {
                        id: 'mix',
                        title: 'A thoughtful mix',
                        subtitle: 'Surprise within their interests',
                        icon: 'both',
                    },
                ],
            },
        ],
    },
    {
        id: 'step-5',
        stepNumber: 5,
        totalSteps: 5,
        title: 'Interest areas',
        description: 'What categories interest them most?',
        questions: [
            {
                id: 'q5-interests',
                questionNumber: 5,
                title: 'Pick their top interest',
                hint: 'We\'ll prioritize gifts in this area.',
                options: [
                    {
                        id: 'tech',
                        title: 'Tech & gadgets',
                        subtitle: 'Latest devices and accessories',
                        icon: 'tech',
                    },
                    {
                        id: 'wellness',
                        title: 'Wellness & self-care',
                        subtitle: 'Relaxation and health',
                        icon: 'wellness',
                    },
                    {
                        id: 'food',
                        title: 'Food & drinks',
                        subtitle: 'Gourmet treats and experiences',
                        icon: 'food',
                    },
                ],
            },
        ],
    },
];

import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import ProgressBar from '@/components/quiz/ProgressBar';
import QuizOptionCard from '@/components/quiz/QuizOptionCard';
import StepBadge from '@/components/quiz/StepBadge';
import QuizIcon from '@/components/icons/QuizIcons';
import { QUIZ_DATA, QuizAnswers, QuizStep, QuizQuestion } from '@/types/quiz';

export default function GiftQuizScreen() {
    const router = useRouter();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswers>({});

    const currentStep: QuizStep = useMemo(
        () => QUIZ_DATA[currentStepIndex],
        [currentStepIndex]
    );

    const currentQuestion: QuizQuestion = useMemo(
        () => currentStep.questions[0],
        [currentStep]
    );

    const progress = useMemo(
        () => ((currentStepIndex + 1) / QUIZ_DATA.length) * 100,
        [currentStepIndex]
    );

    const selectedOptionId = useMemo(
        () => answers[currentQuestion.id] || null,
        [answers, currentQuestion.id]
    );

    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === QUIZ_DATA.length - 1;

    const handleBack = useCallback(() => {
        if (isFirstStep) {
            router.back();
        } else {
            setCurrentStepIndex((prev) => prev - 1);
        }
    }, [isFirstStep, router]);

    const handleSkipAll = useCallback(() => {
        router.back();
    }, [router]);

    const handleSelectOption = useCallback((optionId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: optionId,
        }));
    }, [currentQuestion.id]);

    const handleNext = useCallback(() => {
        if (isLastStep) {
            router.back();
        } else {
            setCurrentStepIndex((prev) => prev + 1);
        }
    }, [isLastStep, answers, router]);

    const handleSkipQuestion = useCallback(() => {
        if (isLastStep) {
            router.back();
        } else {
            setCurrentStepIndex((prev) => prev + 1);
        }
    }, [isLastStep, router]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={Colors.light.foreground}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gift quiz</Text>
                <TouchableOpacity
                    style={styles.skipAllButton}
                    onPress={handleSkipAll}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Skip quiz"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.skipAllText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <StepBadge
                    currentStep={currentStep.stepNumber}
                    totalSteps={currentStep.totalSteps}
                />

                <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>{currentStep.title}</Text>
                    <Text style={styles.stepDescription}>
                        {currentStep.description}
                    </Text>
                </View>

                <View style={styles.progressContainer}>
                    <ProgressBar progress={progress} showPercentage={true} />
                </View>

                <View style={styles.questionSection}>
                    <View style={styles.questionHeader}>
                        <View style={styles.questionIconContainer}>
                            <QuizIcon
                                type={currentQuestion.options[0]?.icon || 'both'}
                                size={20}
                                color={Colors.light.primary}
                            />
                        </View>
                        <Text style={styles.questionLabel}>
                            Question {currentQuestion.questionNumber}
                        </Text>
                    </View>

                    <Text style={styles.questionTitle}>
                        {currentQuestion.title}
                    </Text>

                    <Text style={styles.questionHint}>
                        {currentQuestion.hint}
                    </Text>

                    <View
                        style={styles.optionsContainer}
                        accessible={true}
                        accessibilityRole="radiogroup"
                        accessibilityLabel={`${currentQuestion.title}. Select one option.`}
                    >
                        {currentQuestion.options.map((option, index) => (
                            <QuizOptionCard
                                key={option.id}
                                option={option}
                                isSelected={selectedOptionId === option.id}
                                onSelect={handleSelectOption}
                                index={index}
                            />
                        ))}
                    </View>

                    <Text style={styles.helperText}>
                        These answers help auto-fill their interests for smarter suggestions.
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <Button
                    title={isLastStep ? 'Finish' : 'Next'}
                    onPress={handleNext}
                    variant="primary"
                    disabled={!selectedOptionId}
                    style={styles.nextButton}
                    accessibilityLabel={isLastStep ? 'Finish quiz' : 'Go to next question'}
                />
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleSkipQuestion}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Skip this question"
                >
                    <Text style={styles.skipButtonText}>Skip this question</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.border,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.foreground,
        fontFamily: 'Inter_600SemiBold',
    },
    skipAllButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    skipAllText: {
        fontSize: 16,
        color: Colors.light.mutedForeground,
        fontFamily: 'Inter_400Regular',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
    },
    stepHeader: {
        marginTop: 20,
        marginBottom: 24,
    },
    stepTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.light.foreground,
        marginBottom: 8,
        letterSpacing: -0.5,
        fontFamily: 'Inter_700Bold',
    },
    stepDescription: {
        fontSize: 16,
        color: Colors.light.mutedForeground,
        lineHeight: 24,
        fontFamily: 'Inter_400Regular',
        letterSpacing: 0.2,
    },
    progressContainer: {
        marginBottom: 32,
    },
    questionSection: {
        flex: 1,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    questionIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: Colors.light.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    questionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.primary,
        fontFamily: 'Inter_600SemiBold',
        letterSpacing: 0.2,
    },
    questionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.light.foreground,
        marginBottom: 8,
        fontFamily: 'Inter_600SemiBold',
        letterSpacing: -0.3,
    },
    questionHint: {
        fontSize: 15,
        color: Colors.light.mutedForeground,
        marginBottom: 24,
        fontFamily: 'Inter_400Regular',
        lineHeight: 22,
    },
    optionsContainer: {
        marginBottom: 16,
    },
    helperText: {
        fontSize: 13,
        color: Colors.light.mutedForeground,
        textAlign: 'left',
        lineHeight: 20,
        fontFamily: 'Inter_400Regular',
    },
    bottomContainer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: Platform.OS === 'ios' ? 24 : 16,
        borderTopWidth: 1,
        borderTopColor: Colors.light.border,
        backgroundColor: Colors.light.background,
    },
    nextButton: {
        marginBottom: 12,
    },
    skipButton: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    skipButtonText: {
        fontSize: 15,
        color: Colors.light.mutedForeground,
        fontFamily: 'Inter_400Regular',
    },
});

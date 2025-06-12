// services/quizService.ts
import { useState } from "react";
import { ApolloError } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";
import {
  CREATE_QUIZ,
  UPDATE_QUIZ,
  ADD_QUESTION_TO_QUIZ,
  UPDATE_QUESTION,
  DELETE_QUESTION,
  DELETE_QUIZ,
} from "@/api/course/mutation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { GraphQLFormattedError } from "graphql";

export interface ChoiceInputType {
  text: string;
  isCorrect: boolean;
  order: number;
  id?: number;
}

export const useQuizOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createQuiz = async (variables: {
    sectionId: number;
    title: string;
    description?: string;
    allowMultipleAttempts?: boolean;
    maxAttempts?: number;
    passingScorePercent?: number;
    timeLimitMinutes?: number;
  }) => {
    return executeMutation(CREATE_QUIZ, variables);
  };

  const updateQuiz = async (variables: {
    quizId: number;
    title?: string;
    description?: string;
    allowMultipleAttempts?: boolean;
    maxAttempts?: number;
    passingScorePercent?: number;
    timeLimitMinutes?: number;
  }) => {
    return executeMutation(UPDATE_QUIZ, variables);
  };

  const addQuestionToQuiz = async (variables: {
    quizId: number;
    text: string;
    questionType: "MC"; // Updated enum value
    order: number;
    explanation?: string;
    mediaUrl?: string;
    maxPoints?: number;
    choices: ChoiceInputType[];
    relatedLectureId?: number;
  }) => {
    return executeMutation(ADD_QUESTION_TO_QUIZ, {
      input: {
        // Wrap in 'input' object if your mutation expects it
        ...variables,
        questionType: "MC", // Ensure consistent enum value
      },
    });
  };

  const deleteQuiz = async (variables: { quizId: number }) => {
    return executeMutation(DELETE_QUIZ, variables);
  };

  const updateQuestion = async (variables: {
    questionId: number;
    text?: string;
    choices?: ChoiceInputType[];
  }) => {
    console.log("🚨 updateQuestion payload:", variables.questionId);
    return executeMutation(UPDATE_QUESTION, variables);
  };

  const deleteQuestion = async (variables: { questionId: number }) => {
    return executeMutation(DELETE_QUESTION, variables);
  };

  const executeMutation = async (mutation: any, variables: any) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Sending GraphQL mutation with variables:", variables);

      const authToken = Cookies.get("auth_token");

      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const { data, errors } = await apolloClient.mutate({
        mutation,
        variables,
        fetchPolicy: "no-cache",
      });

      if (errors) {
        console.log("GraphQL errorssss:", errors);
        handleGraphQLErrors(errors);
      }

      return data;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGraphQLErrors = (errors: readonly GraphQLFormattedError[]) => {
    const authErrors = errors.filter(
      (err) =>
        err.message.toLowerCase().includes("auth") ||
        err.message.toLowerCase().includes("token") ||
        err.message.toLowerCase().includes("credentials") ||
        err.message.toLowerCase().includes("permission")
    );

    if (authErrors.length > 0) {
      throw new Error("Authentication failed. Please try logging in again.");
    }

    throw new Error(
      errors[0]?.message || "An error occurred during the operation"
    );
  };

  const handleError = (err: any) => {
    console.error("Operation error:", err);

    if (err instanceof ApolloError) {
      if (err.networkError) {
        setError(new Error("Network error. Please check your connection."));
      } else if (err.message.includes("Authentication")) {
        setError(new Error("Authentication failed. Please log in again."));
      } else {
        setError(new Error(err.message));
      }
    } else if (err instanceof Error) {
      setError(err);
    } else {
      setError(new Error("An unexpected error occurred"));
    }

    toast.error(err instanceof Error ? err.message : "Operation failed");
  };

  return {
    createQuiz,
    updateQuiz,
    addQuestionToQuiz,
    updateQuestion,
    deleteQuestion,
    deleteQuiz,
    loading,
    error,
  };
};

import { CREATE_LEARNING_REMINDER, DELETE_LEARNING_REMINDER, UPDATE_LEARNING_REMINDER } from "@/api/course/mutation";
import { GET_USER_LEARNING_REMINDER } from "@/api/course/queries";
import { apolloClient } from "@/lib/apollo-client";

const CourseReminderService = () => {
  const createLearningReminder = async ({
    calendarService,
    description,
    schedule,
    course,
    icsFile,
    serviceEventId,
    setLoading,
    setError,
  }: {
    calendarService: "GOOGLE" | "APPLE" | "OUTLOOK";
    description?: string | null;
    schedule: {
      date?: string;
      days?: string[];       // Array of day strings, e.g. ["MONDAY"]
    //   frequency: "DAILY" | "WEEKLY" | "ONCE";
    frequency: any,
      time: string;
    };
    course:  number | undefined;
    icsFile?: string;
    serviceEventId?: string;
    setLoading?: (v: boolean) => void;
    setError?: (e: Error | null) => void;
  }) => {
    try {
      setLoading?.(true);
      setError?.(null);

      const { data, errors } = await apolloClient.mutate({
        mutation: CREATE_LEARNING_REMINDER,
        variables: {
          calendarService,
          description,
          schedule,
          course,
          icsFile,
          serviceEventId,
        },
        context: { includeAuth: true },
        fetchPolicy: "no-cache",
      });

      if (errors) {
        console.log("GraphQL errors creating reminder:", errors);
        throw new Error(errors[0]?.message || "Failed to create reminder");
      }

      if (data && data.createLearningReminder?.success) {
        return { success: true };
      }
      throw new Error("Reminder not returned by API");
    } catch (err) {
      console.error("Error creating learning reminder:", err);
      setError?.(
        err instanceof Error ? err : new Error("Failed to create learning reminder")
      );
      return { success: false };
    } finally {
      setLoading?.(false);
    }
  };


  const getLearningReminders = async ({
    pageCount = 10,
    pageNumber = 1,
    setLoading,
    setError,
  }: {
    pageCount?: number;
    pageNumber?: number;
    setLoading?: (v: boolean) => void;
    setError?: (e: Error | null) => void;
  }) => {
    try {
      setLoading?.(true);
      setError?.(null);

      const { data, errors } = await apolloClient.query({
        query: GET_USER_LEARNING_REMINDER,
        variables: { pageCount, pageNumber },
        fetchPolicy: "no-cache",
        context: { includeAuth: true },
      });

      if (errors) {
        console.log("GraphQL errors fetching reminders:", errors);
        throw new Error(errors[0]?.message || "Failed to fetch reminders");
      }

      if (data && data.userLearningReminder) {
        return { success: true, reminders: data.userLearningReminder };
      }
      throw new Error("No reminders returned by API");
    } catch (err) {
      console.error("Error fetching learning reminders:", err);
      setError?.(
        err instanceof Error ? err : new Error("Failed to fetch learning reminders")
      );
      return { success: false, reminders: [] };
    } finally {
      setLoading?.(false);
    }
  };

  const deleteLearningReminder = async ({
    learningReminderId,
    setLoading,
    setError,
  }: {
    learningReminderId: number;
    setLoading?: (v: boolean) => void;
    setError?: (e: Error | null) => void;
  }) => {
    try {
      setLoading?.(true);
      setError?.(null);

      const { data, errors } = await apolloClient.mutate({
        mutation: DELETE_LEARNING_REMINDER,
        variables: { learningReminderId },
        context: { includeAuth: true },
        fetchPolicy: "no-cache",
      });

      if (errors) {
        throw new Error(errors[0]?.message || "Failed to delete reminder");
      }

      if (data?.deleteLearningReminder?.success) {
        return { success: true, message: data.deleteLearningReminder.message };
      }
      throw new Error("Reminder not deleted by API");
    } catch (err) {
      setError?.(
        err instanceof Error ? err : new Error("Failed to delete learning reminder")
      );
      return { success: false, message: err };
    } finally {
      setLoading?.(false);
    }
  };

  const updateLearningReminder = async ({
  learningReminderId,
  description,
  courseId,
  icsFile,
  removeCourse,
  schedule,
  setLoading,
  setError,
}: {
  courseId: number | undefined
  learningReminderId: number;
  description?: string | null;
  icsFile?: string;
  removeCourse?: boolean;
  schedule: {
    date?: string;
    days?: string[];         // ["MONDAY"]
    frequency: string;       // "DAILY", "WEEKLY", etc.
    time?: string;
  };
  setLoading?: (v: boolean) => void;
  setError?: (e: Error | null) => void;
}) => {
  try {
    setLoading?.(true);
    setError?.(null);

    const { data, errors } = await apolloClient.mutate({
      mutation: UPDATE_LEARNING_REMINDER,
      variables: {
        learningReminderId,
        description,
        icsFile,
        removeCourse,
        schedule,
        courseId,
      },
      context: { includeAuth: true },
      fetchPolicy: "no-cache",
    });

    if (errors) {
      throw new Error(errors[0]?.message || "Failed to update reminder");
    }

    if (data?.updateLearningReminder?.success) {
      return { success: true, message: data.updateLearningReminder.message };
    }
    throw new Error("Reminder not updated by API");
  } catch (err) {
    setError?.(
      err instanceof Error ? err : new Error("Failed to update learning reminder")
    );
    return { success: false, message: err };
  } finally {
    setLoading?.(false);
  }
};


  return { createLearningReminder, getLearningReminders, deleteLearningReminder, updateLearningReminder };
};

export default CourseReminderService;

"use client";
import { ExtendedLecture } from "@/lib/types";
import { Clock, User } from "lucide-react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

import { LiaFileDownloadSolid } from "react-icons/lia";
import RichTextEditor from "./NewRichTextEditor";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosInformationCircleOutline } from "react-icons/io";

export default function AssignmentPreview({
  assignmentData,
  setAssignmentStatus,
  assignmentStatus,
}: {
  assignmentData: ExtendedLecture;
  skipAssignment?: () => void;
  startAssignment?: boolean;
  setAssignmentStatus: React.Dispatch<
    React.SetStateAction<
      "overview" | "assignment" | "summary/feedback"
    >
  >
  assignmentStatus?: "overview" | "assignment" | "summary/feedback";
}) {
  const [step, setStep] = useState<
    "instructions" | "submissions" | "instructorExample" | "giveFeedback"
  >("instructions");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionTime, setSubmissionTime] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sharePreference, setSharePreference] = useState(false);
  const [learnedContent, setLearnedContent] = useState("");
  const [showLearnedInput, setShowLearnedInput] = useState(false);

  const resourceRef = useRef<HTMLDivElement>(null);

  // Calculate duration text
  const durationText = `${assignmentData.estimatedDuration} ${assignmentData.durationUnit}`;

  // Handle navigation to step
  const handleStepNavigation = (newStep: typeof step) => {
    setStep(newStep);
  };

  // Handle next step
  const handleNext = () => {
    if (step === "instructions") setStep("submissions");
    else if (step === "submissions") setStep("instructorExample");
    else if (step === "instructorExample") setStep("giveFeedback");
    else if (step === "giveFeedback") setAssignmentStatus("summary/feedback");
  };

  // Handle previous step
  const handlePrevious = () => {
    if (step === "submissions") setStep("instructions");
    else if (step === "instructorExample") setStep("submissions");
    else if (step === "giveFeedback") setStep("instructorExample");
  };

  // Handle answer change
  const handleAnswerChange = (questionId: string, content: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: content }));
  };

  // Handle save draft
  const handleSaveDraft = () => {
    // In a real app, you would save to backend/local storage
    console.log("Draft saved", answers);
  };

  useEffect(() => {
    return () => {
      // Clean up object URLs when component unmounts
      if (assignmentData.instructionalVideo?.file) {
        URL.revokeObjectURL(assignmentData.instructionalVideo.url as string);
      }
      if (assignmentData.solutionVideo?.file) {
        URL.revokeObjectURL(assignmentData.solutionVideo.url as string);
      }
    };
  }, []);
  // Handle submit assignment
  const handleSubmitAssignment = () => {
    setIsSubmitted(true);
    setSubmissionTime(new Date().toLocaleString());
    // In a real app, you would submit to backend
    console.log("Assignment submitted", answers);
  };

  // Handle download resource
  const handleDownloadResource = (resource: {
    file?: File;
    url: string;
    name?: string;
  }) => {
    if (resource.file) {
      const url = URL.createObjectURL(resource.file);
      const a = document.createElement("a");
      a.href = url;
      a.download = resource.name || "resource";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (resource.url) {
      // Handle URL download (mock implementation)
      console.log("Downloading resource from URL:", resource.url);
    }
  };

  // Scroll to resource
  const scrollToResource = () => {
    resourceRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle learned content submission
  const handleLearnedSubmit = () => {
    setShowLearnedInput(false);
    // In a real app, you would save this to backend
    console.log("Learned content submitted:", learnedContent);
  };

  return (
    <div className=" w-full h-full relative ">
      {/* <div className="h-full flex-1 overflow-y-auto "> */}
      <main className="flex-1 overflow-y-auto h-full w-full pb-20 px-2">
        {assignmentStatus === "overview" && (
          <div className="max-w-3xl mx-auto pt-10">
            <h2 className="text-2xl font-bold mb-2 text-zinc-700">
              Assignment: <span>{assignmentData.assignmentTitle}</span>
            </h2>
            <p className="flex items-center gap-2 text-gray-600 mb-4">
              <Clock size={15} />
              <span>{durationText} to complete</span>
              {isSubmitted && (
                <span className="border-l-2 pl-2 flex items-center">
                  <User size={17} />
                  <button className="text-purple-600 font-bold text-sm cursor-pointer">
                    1 student solution
                  </button>
                </span>
              )}
            </p>

            {/* Description */}
            <p className="mt-8">{assignmentData.assignmentDescription}</p>
          </div>
        )}

        {assignmentStatus === "summary/feedback" && (
          <div>
            <div className="bg-slate-50 h-48 flex items-center">
              <div className="max-w-3xl mx-auto w-full space-y-2">
                <h1 className="font-bold text-2xl">
                  Great job, you finished this assignment!
                </h1>
                <p>{assignmentData.assignmentTitle}</p>
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-4 text-center max-w-xl mx-auto mt-8">
              <h2 className="font-bold">You don't have any feedback yet</h2>
              <p>
                Don't worry, we'll notify you when you receive feedback on your
                work.
              </p>
            </div>
          </div>
        )}

        {assignmentStatus === "assignment" && (
          <>
            {/* Nav */}
            <div className="max-w-3xl mx-auto h-24 flex items-center sticky top-0 bg-white">
              <div className="flex items-center justify-evenly relative w-full z-10 ">
                <div
                  onClick={() => handleStepNavigation("instructions")}
                  className="flex flex-col items-center gap-4 cursor-pointer absolute left-0 top-0 -translate-x-1/2"
                >
                  <p>Instructions</p>
                  <p
                    className={`size-4 rounded-full transition ${
                      step === "instructions"
                        ? "bg-purple-600"
                        : "bg-indigo-300"
                    }`}
                  ></p>
                </div>
                <div
                  onClick={() => handleStepNavigation("submissions")}
                  className="flex flex-col items-center gap-4 cursor-pointer"
                >
                  <p>Submissions</p>
                  <p
                    className={`size-4 rounded-full transition ${
                      step === "submissions" ? "bg-purple-600" : "bg-indigo-300"
                    }`}
                  ></p>
                </div>
                <div
                  onClick={() => handleStepNavigation("instructorExample")}
                  className="flex flex-col items-center gap-4 cursor-pointer"
                >
                  <p>Instuctor example</p>
                  <p
                    className={`size-4 rounded-full transition ${
                      step === "instructorExample"
                        ? "bg-purple-600"
                        : "bg-indigo-300"
                    }`}
                  ></p>
                </div>
                <div
                  onClick={() => handleStepNavigation("giveFeedback")}
                  className="flex flex-col items-center gap-4 cursor-pointer absolute right-0 top-0 translate-x-1/2"
                >
                  <p>Give feedback</p>
                  <p
                    className={`size-4 rounded-full transition ${
                      step === "giveFeedback"
                        ? "bg-purple-600"
                        : "bg-indigo-300"
                    }`}
                  ></p>
                </div>
              </div>
              <div className="bg-indigo-300 h-1.5 absolute w-full top-[65px] left-0"></div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto py-6">
              <div className="">
                {step === "instructions" && (
                  <Instructions
                    assignmentData={assignmentData}
                    scrollToResource={scrollToResource}
                    resourceRef={resourceRef}
                  />
                )}
                {step === "submissions" && (
                  <Submissions
                    assignmentData={assignmentData}
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                    isSubmitted={isSubmitted}
                    onSaveDraft={handleSaveDraft}
                    onSubmit={handleSubmitAssignment}
                    sharePreference={sharePreference}
                    onSharePreferenceChange={setSharePreference}
                  />
                )}
                {step === "instructorExample" && (
                  <InstructorExample
                    assignmentData={assignmentData}
                    answers={answers}
                    isSubmitted={isSubmitted}
                    submissionTime={submissionTime}
                    learnedContent={learnedContent}
                    onLearnedContentChange={setLearnedContent}
                    showLearnedInput={showLearnedInput}
                    onShowLearnedInputChange={setShowLearnedInput}
                    onLearnedSubmit={handleLearnedSubmit}
                    onDownloadResource={handleDownloadResource}
                  />
                )}
                {step === "giveFeedback" && <GiveFeedback />}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Controls */}
      <div className="flex justify-between items-center px-4 h-14 bg-white w-full absolute bottom-0 left-0">
        {/* Left hand side */}
        <div>
          {isSubmitted && assignmentStatus === "overview" && (
            <button
              onClick={() => setAssignmentStatus("summary/feedback")}
              className="px-3 py-1 border border-purple-600 text-purple-600 hover:bg-purple-100 transition cursor-pointer"
            >
              Go to summary
            </button>
          )}
          {assignmentStatus === "summary/feedback" && (
            <button
              onClick={() => setAssignmentStatus("assignment")}
              className="transition px-4 py-2 rounded hover:bg-neutral-200 cursor-pointer"
            >
              Back to assignment
            </button>
          )}
        </div>

        {/* Right hand side */}
        <div>
            {assignmentStatus === "assignment" && (
            <>
              {step !== "instructions" && (
                <button
                  onClick={handlePrevious}
                  className="transition px-4 py-2 rounded hover:bg-neutral-200 cursor-pointer"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer transition"
              >
                {step === "giveFeedback" ? "Go to feedback" : "Next"}
              </button>
            </>
          )}

          {assignmentStatus === "summary/feedback" && (
            <button className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 cursor-pointer transition">
              Next lecture
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const Instructions = ({
  assignmentData,
  scrollToResource,
  resourceRef,
}: {
  assignmentData: ExtendedLecture;
  scrollToResource: () => void;
  resourceRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-zinc-700">
          Assignment Instructions
        </h2>
        <p className="flex items-center gap-2 text-gray-600 mb-4">
          <Clock size={15} />
          <span>
            {assignmentData.estimatedDuration} {assignmentData.durationUnit} to
            complete
          </span>
          {assignmentData.instructionalResource && (
            <span className="border-l-2 pl-2 flex items-center">
              <LiaFileDownloadSolid size={17} />
              <button
                onClick={scrollToResource}
                className="text-purple-600 font-bold text-sm cursor-pointer"
              >
                Resource available
              </button>
            </span>
          )}
        </p>
      </div>

      <div className="shadow-sm shadow-purple-200 p-6 border border-gray-400/40 divide-y divide-gray-300">
        {assignmentData.instructionalVideo?.url ||
        assignmentData.instructionalVideo?.file ? (
          <div className="h-80 flex items-center justify-center bg-gray-100">
            <video controls className="max-w-full max-h-full">
              <source
                src={
                  assignmentData.instructionalVideo.url ||
                  (assignmentData.instructionalVideo.file
                    ? URL.createObjectURL(
                        assignmentData.instructionalVideo.file
                      )
                    : undefined) // Use undefined instead of empty string
                }
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="text-gray-800 h-80 flex items-center">
            <div className="max-w-xl mx-auto">
              Your video failed to process for the following reasons:
              <ul className="list-disc pl-5">
                <li>
                  Your video didn't meet our lowest permissible resolution of at
                  least 720p.{" "}
                  <Link
                    href={"#"}
                    className="text-purple-600 underline cursor-pointer hover:text-purple-800 transition"
                  >
                    Get Help
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div>
          <div className="pt-4">
            <h3 className="font-bold mb-2">Questions for this assignment</h3>
            <ul className="list-decimal pl-5 space-y-2">
              {assignmentData.assignmentQuestions?.map((question) => (
                <li key={question.id}>{question.content}</li>
              ))}
            </ul>
          </div>

          {assignmentData.instructionalResource && (
            <div className="pt-4" ref={resourceRef}>
              <h3 className="text-sm font-bold mb-2">
                Download resource files
              </h3>
              <div className="flex items-center gap-2 text-purple-600 hover:bg-purple-100 transition rounded p-2 cursor-pointer">
                <LiaFileDownloadSolid size={17} />
                <span>
                  {assignmentData.instructionalResource.name ||
                    assignmentData.instructionalResource.file?.name ||
                    "Resource"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Submissions = ({
  assignmentData,
  answers,
  onAnswerChange,
  isSubmitted,
  onSaveDraft,
  onSubmit,
  sharePreference,
  onSharePreferenceChange,
}: {
  assignmentData: ExtendedLecture;
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, content: string) => void;
  isSubmitted: boolean;
  onSaveDraft: () => void;
  onSubmit: () => void;
  sharePreference: boolean;
  onSharePreferenceChange: (value: boolean) => void;
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-zinc-700">
          Assignment submission
        </h2>
        <p className="flex items-center gap-2 text-gray-600 mb-4">
          <span>Save or submit your work</span>
          {isSubmitted && (
            <button className="bg-green-400/50 text-black rounded-md px-2 py-px text-sm font-semibold">
              Assignment submitted
            </button>
          )}
        </p>
      </div>

      <div className="shadow-sm shadow-purple-200 py-6 px-10 border border-gray-400/40">
        <ul>
          {assignmentData.assignmentQuestions?.map((question) => (
            <li key={question.id} className="list-decimal mb-6">
              <h3 className="mb-2">{question.content}</h3>
              <RichTextEditor
                value={answers[question.id] || ""}
                onChange={(value) => onAnswerChange(question.id, value)}
                placeholder="Add your submission"
                type="instruction"
                readOnly={isSubmitted}
              />
            </li>
          ))}

          <li className="pt-4 list-decimal">
            <h3 className="font-bold mb-2">Choose your sharing preference</h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="share-pref"
                checked={sharePreference}
                onChange={(e) => onSharePreferenceChange(e.target.checked)}
                className="size-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                disabled={isSubmitted}
              />
              <label
                htmlFor="share-pref"
                className="cursor-pointer text-gray-500 text-sm"
              >
                Yes, I want to get feedback from my fellow student
              </label>
            </div>
          </li>
        </ul>

        {!isSubmitted && (
          <div className="mt-4 space-x-3">
            <button
              onClick={onSaveDraft}
              className="hover:bg-purple-100 text-purple-600 px-5 py-2 rounded text-sm font-bold border border-purple-600 transition cursor-pointer"
            >
              Save draft
            </button>
            <button
              onClick={onSubmit}
              className="hover:bg-purple-100 text-purple-600 px-5 py-2 rounded text-sm font-bold border border-purple-600 transition cursor-pointer"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const InstructorExample = ({
  assignmentData,
  answers,
  isSubmitted,
  submissionTime,
  learnedContent,
  onLearnedContentChange,
  showLearnedInput,
  onShowLearnedInputChange,
  onLearnedSubmit,
  onDownloadResource,
}: {
  assignmentData: ExtendedLecture;
  answers: Record<string, string>;
  isSubmitted: boolean;
  submissionTime: string;
  learnedContent: string;
  onLearnedContentChange: (content: string) => void;
  showLearnedInput: boolean;
  onShowLearnedInputChange: (show: boolean) => void;
  onLearnedSubmit: () => void;
  onDownloadResource: (resource: any) => void;
}) => {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-zinc-700">
          How did you do?
        </h2>
        <p className="flex items-center gap-2 text-gray-600 mb-4">
          Compare the instructor's example to your own
        </p>
      </div>

      <div className="shadow-sm shadow-purple-200 p-6 border border-gray-400/40">
        <div className="border-b border-gray-400/20 pb-4">
          <h2 className="font-bold">Instructor example</h2>

          <div className="flex gap-3 mt-2">
            <div className="size-12 bg-black rounded-full text-white flex justify-center items-center">
              SA
            </div>
            <div>
              <Link
                href={"#"}
                className="text-purple-600 font-semibold text-sm cursor-pointer"
              >
                Instructor
              </Link>
            </div>
          </div>

          <ul className="list-decimal pl-6 marker:font-bold mt-4">
            {assignmentData.assignmentQuestions?.map((question, index) => (
              <li key={question.id} className="space-y-2 text-sm">
                <p>{question.content}</p>
                {question.solution && <p>{question.solution}</p>}
              </li>
            ))}
          </ul>

          {assignmentData.solutionResource && (
            <div className="pt-4">
              <h3 className="text-sm font-bold mb-2">
                Download resource files
              </h3>
              <div
                onClick={() =>
                  onDownloadResource(assignmentData.solutionResource!)
                }
                className="flex items-center gap-2 text-purple-600 hover:bg-purple-100 transition rounded p-2 cursor-pointer"
              >
                <LiaFileDownloadSolid size={17} />
                <span>
                  {assignmentData.solutionResource.name ||
                    assignmentData.solutionResource.file?.name ||
                    "Resource"}
                </span>
              </div>
            </div>
          )}
        </div>

        {assignmentData.solutionVideo?.url ||
        assignmentData.solutionVideo?.file ? (
          <div className="h-80 flex items-center justify-center bg-gray-100">
            <video controls className="max-w-full max-h-full">
              <source
                // src={
                //   assignmentData.solutionVideo.url ||
                //   URL.createObjectURL(assignmentData.solutionVideo.file!)
                // }
                src={
                  assignmentData.solutionVideo.url ||
                  (assignmentData.solutionVideo.file
                    ? URL.createObjectURL(assignmentData.solutionVideo.file)
                    : undefined) // Use undefined instead of empty string
                }
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="text-gray-800 h-80 flex items-center border-b border-gray-400/50">
            <div className="max-w-xl mx-auto">
              Your video failed to process for the following reasons:
              <ul className="list-disc pl-5">
                <li>
                  Your video didn't meet our lowest permissible resolution of at
                  least 720p.{" "}
                  <Link
                    href={"#"}
                    className="text-purple-600 underline cursor-pointer hover:text-purple-800 transition"
                  >
                    Get Help
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="shadow-sm shadow-purple-200 p-6 border border-gray-400/40">
        <div className="border-b border-gray-400/20 pb-4">
          <h2 className="font-bold">Your Submission</h2>

          <div className="flex gap-3 mt-2 items-center">
            <div className="size-12 bg-black rounded-full text-white flex justify-center items-center">
              SA
            </div>
            <div>
              <Link
                href={"#"}
                className="text-purple-600 font-semibold text-sm cursor-pointer"
              >
                Student
              </Link>
              {isSubmitted && <p>Posted {submissionTime}</p>}
            </div>
          </div>

          <ul className="list-decimal pl-6 marker:font-bold mt-4">
            {assignmentData.assignmentQuestions?.map((question, index) => (
              <li key={question.id} className="space-y-2 text-sm">
                <p>{question.content}</p>
                {answers[question.id] && <p>{answers[question.id]}</p>}
              </li>
            ))}
          </ul>
        </div>

        {isSubmitted ? (
          <div className="mt-8">
            <h3>How did you do on this exercise?</h3>
            <p>
              Take a moment to reflect on what you learned from this exercise
            </p>

            <div className="flex gap-2 mt-4">
              <div className="size-12 bg-black rounded-full text-white flex justify-center items-center shrink-0">
                SA
              </div>

              {showLearnedInput ? (
                <div className="w-full">
                  <RichTextEditor
                    value={learnedContent}
                    onChange={onLearnedContentChange}
                    placeholder="I learned"
                    type="instruction"
                  />
                  <div className="mt-4 text-sm space-x-2">
                    <button
                      onClick={onLearnedSubmit}
                      className="bg-purple-600 hover:bg-purple-800 text-white px-3 py-1 rounded cursor-pointer transition"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => onShowLearnedInputChange(false)}
                      className="px-3 py-1 rounded hover:bg-gray-200 cursor-pointer transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => onShowLearnedInputChange(true)}
                  className="w-full outline-none border px-2 py-2 rounded cursor-text"
                >
                  {learnedContent || "I learned..."}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`rounded-2xl w-full px-6 py-3 border border-purple-600 flex gap-4 mb-6 items-center`}
          >
            <IoIosInformationCircleOutline
              size={30}
              className="text-purple-500"
            />
            <div className="space-y-2">
              <p className="font-bold">
                You haven't answered the assignment yet.
              </p>
              <p>
                Submit your work to get constructive feedback from your
                instructors and peers.
              </p>
              <button className="px-3 py-1 border border-purple-600 text-purple-600 hover:bg-purple-100 transition cursor-pointer">
                Add your answer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GiveFeedback = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-zinc-700">
          Give feedback to 3 other students
        </h2>
        <p className="flex items-center gap-2 text-gray-600 mb-4">
          Reflecting on other students' work is likely to increase your own
          understanding
        </p>
      </div>

      <div className="py-15">
        <div className="text-center max-w-xl mx-auto">
          <FaCircleCheck className="mx-auto" size={30} />
          <h3 className="font-bold mt-4">
            Congratulations, you're the first student to complete this
            assignment
          </h3>
          <p className="mt-4">
            There are no other student submissions to review at this time, but
            you can check back later if you'd like to help other students with
            what you've learned on this assignment.
          </p>
        </div>
      </div>
    </div>
  );
};

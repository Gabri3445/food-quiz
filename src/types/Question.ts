import Answer from "~/types/Answer";

interface Question {
    question: string;
    answers: Answer[];
}

export default Question;
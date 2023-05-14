"use client";

import {ChangeEvent, useState} from "react";
import {useRouter} from "next/navigation";
import Form from "~/components/Form";
import Question from "~/types/Question";

interface Props {
    questionsS: string;
}

const Content = ({questionsS}: Props) => {
    const questions = JSON.parse(questionsS) as Question[];
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
    const [score, setScore] = useState(0);
    const [checkedElement, setCheckedElement] = useState<HTMLInputElement | null>(null);
    const router = useRouter();

    const handleClick = () => {
        if (currentQuestionNumber < questions.length - 1 && checkedElement) {
            setScore(score + Number(checkedElement.value));
            setCurrentQuestionNumber(currentQuestionNumber + 1);
            checkedElement.checked = false;
            setCheckedElement(null);
        } else if (checkedElement) {
            router.push(`/result/${score + Number(checkedElement.value)}`);
        }
    };

    const onFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setCheckedElement(target);
    };
    return (
        <div className="w-screen h-screen  bg-gray-800">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl font-bold text-center text-white">Which Food Are You?</h1>
                <div className="flex justify-center pt-14">
                    <Form
                        question={questions[currentQuestionNumber]!}
                        onClick={handleClick}
                        onChange={onFormChange}
                    />
                </div>
            </div>
        </div>
    );

};

export default Content;
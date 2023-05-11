import {GetStaticProps, type NextPage} from "next";
import {ChangeEvent, MouseEvent, useState} from "react";
import Form, {FormProps} from "~/components/Form";
import Question from "~/types/Question";
import path from "path";
import Result from "~/types/Result";
import {promises as fs} from 'fs';

interface Props {
    questions: Question[];
    results: Result[];
}

const Home: NextPage<Props> = (props: Props) => {
    let [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
    let [score, setScore] = useState(0);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        console.log(e.target);
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target);
    };

    const props2 = {
        questions: [
            {
                question: "What is your name?",
                answers: [
                    {
                        answer: "Joe",
                        score: 1
                    },
                    {
                        answer: "Jane",
                        score: 2
                    }
                ]
            }
        ]
    };

    const formProps: FormProps = {
        question: props2.questions[currentQuestionNumber],
        onClick: handleClick,
        onChange: onChange
    };

    return (
        <>
            <Form question={formProps.question} onClick={formProps.onClick} onChange={formProps.onChange}></Form>
        </>
    );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
    const directory = path.join(process.cwd(), "data");
    const questions = await fs.readFile(path.join(directory, "questions.json"), "utf-8");
    const results = await fs.readFile(path.join(directory, "results.json"), "utf-8");
    return {
        props: {
            questions: JSON.parse(questions),
            results: JSON.parse(results)
        }
    };
};

export default Home;

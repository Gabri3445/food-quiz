import type Question from "~/types/Question";
import type {ChangeEvent, MouseEvent} from "react";

export interface FormProps {
    question: Question;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Form = ({question, onClick, onChange}: FormProps) => {

    return (
        <>
            <span>{question.question}</span>
            {
                question.answers.map((answer, id) => (
                        <div key={id}>
                            <input type="radio" name="answer" value={answer.score} onChange={onChange}/>
                            <label>{answer.answer}</label>
                        </div>
                    )
                )
            }
            <button onClick={onClick}>Submit</button>
        </>
    );
};


export default Form;
import type Question from "~/types/Question";
import type {ChangeEvent, MouseEvent} from "react";

export interface FormProps {
    question: Question;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Form = ({question, onClick, onChange}: FormProps) => {

    return (
        <div>
            <span className="text-white text-lg">{question.question}</span>
            {
                question.answers.map((answer, id) => (
                        <div key={id} className="flex items-center mt-2">
                            <input type="radio" name="answer" id={id.toString()} value={answer.score} onChange={onChange}
                                   className="w-5 h-5 mr-4"/>
                            <label className="text-white" htmlFor={id.toString()}>{answer.answer}</label>
                        </div>
                    )
                )
            }
            <div className="flex mt-5 justify-end">
                <button
                    className="text-white bg-blue-700 hover:bg-white hover:text-blue-700 border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={onClick}>Submit
                </button>
            </div>
        </div>
    );
};


export default Form;
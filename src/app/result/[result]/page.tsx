import Image from "next/image";
import path from "path";
import {promises as fs} from "fs";
import Result from "~/types/Result";


interface PageProps {
    params: {
        result: number
    };
}

const Page = async ({params}: PageProps) => {

    const fetchData = async (): Promise<Result[]> => {
        const directory = path.join(process.cwd(), "data");
        const results = await fs.readFile(path.join(directory, "results.json"), "utf-8");
        return JSON.parse(results) as Result[];
    };

    const score = params.result;

    const results = await fetchData();

    const determineFood = (): string => {
        if (score) {
            for (const result of results) {
                if (score >= result.scoreRange.minScore && score <= result.scoreRange.maxScore) {
                    return result.result;
                }
            }
        }
        return "Error";
    };

    const determineImage = (food: string): string => {
        const images: string[] = [
            "/pizza.png",
            "/sushi.png",
            "/burger.png",
        ];
        if (food.includes("pizza")) {
            if (images[0]) {
                return images[0];
            }
        } else if (food.includes("sushi")) {
            if (images[1]) {
                return images[1];
            }
        }
        if (images[2]) {
            return images[2];
        }
        return "Error";
    };

    const food = determineFood();
    const image = determineImage(food);


    return (
        <div className="w-screen h-screen  bg-gray-800">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl font-bold text-center text-white mb-10">Result</h1>
                <p className="text-3xl font-bold text-center text-white">Score: {score}</p>
                <p className="text-3xl font-bold text-center text-white">{food}</p>
                <div className="flex justify-center mt-10">
                    <Image priority={true} src={image} alt={food} width={512} height={512}></Image>
                </div>
            </div>
        </div>
    );
}

export async function generateStaticParams() {
    const params = [];

    for (let i = 1; i <= 15; i++) {
        params.push({result: i.toString()});
    }

    return params;
}


export default Page;


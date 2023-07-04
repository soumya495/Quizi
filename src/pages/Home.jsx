import logo from "../assets/logo-black.png";
import { Link } from "react-router-dom";
import { ReactComponent as HeroSvg } from "../assets/svgs/hero.svg";

export default function Home() {
  return (
    <>
      <div className="hero min-h-[92vh] bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="w-[300px] md:w-[400px] lg:w-[500px] aspect-square mb-12 rounded-lg lg:mb-0">
            <HeroSvg />
          </div>
          <div>
            <img
              src={logo}
              width={250}
              loading="lazy"
              className="mx-auto lg:mx-0"
            />
            <p className="py-6 max-w-xl text-center lg:text-left">
              Where knowledge meets excitement! <br /> Join now to create
              quizzes, challenge friends in private groups, and test your skills
              with public and private quizzes. Engage, learn, and have fun!
            </p>
            <Link to="/signup">
              <button className="btn btn-primary block mx-auto lg:mx-0">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full mx-auto min-h-[8vh] bg-base-200 grid place-content-center">
        <p className="text-sm tracking-wider">
          Created with ❤️ by{" "}
          <a
            href="https://github.com/soumya495"
            target="_blank"
            rel="noreferrer"
            className="link text-primary font-medium"
          >
            Soumya Banerjee
          </a>
        </p>
      </div>
    </>
  );
}

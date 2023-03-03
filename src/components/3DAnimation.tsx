import Spline from "@splinetool/react-spline";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { doneLoading } from "../state/homeSlice";
import { AppDispatch } from "../store";

export interface IAnimationProps {}

export function Animation({}: IAnimationProps) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <>
      <div className="flex-1 max-h-[60vh] md:h-full">
        <Spline
          onLoad={(e) => {
            //@ts-ignore
            if (!e.disposed) {
              dispatch(doneLoading());
            }
          }}
          scene="https://prod.spline.design/PdWYTq5AvShAZYRj/scene.splinecode"
        />
      </div>
    </>
  );
}

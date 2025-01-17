import {FC} from "react";
import {Header} from "../../../shared/ui/header/header.tsx";
import ListNews from "../../../entities/list/list.tsx";

interface Props {
  className?: string
}

export const News: FC<Props> = ({ className }) => {
  return (
    <div className={className}>
        <Header/>
        <ListNews/>
    </div>
  );
};


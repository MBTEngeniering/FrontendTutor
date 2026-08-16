import { useNavigate } from "react-router-dom";

export default function Linker(props) {
    const navigate = useNavigate();

    function linkTo(link) {
        navigate(link);
    }

    return (
        <div title={props.title ? props.title : props.children} onClick={() => linkTo(props.link)}>{props.children}</div>
    )
}
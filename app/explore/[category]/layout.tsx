import "@deckai/deck-ui/styles/styles.css";
import "styles/globals.css";

export default function Layout(props: { children: React.ReactNode }) {
    return <section>{props.children}</section>
}
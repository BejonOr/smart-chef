import ReactMarkdown from 'react-markdown'
export default function SmartRecipe(props) {
    return (
        <section className="suggested-recipe-container" aira-live="polite">
            <h2>Your Smart Chef Recipe:</h2>
            <ReactMarkdown>{props.recipe}</ReactMarkdown>
        </section>
    )
}
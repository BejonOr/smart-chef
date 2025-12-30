import chefHat from "/images/chefHat.jpg"
export default function Header() {
    return (
        <header>
            <img src={chefHat}/>
            <h1>Smart Chef</h1>
        </header>
    )
}
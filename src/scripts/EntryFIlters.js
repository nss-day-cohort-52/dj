const eventHub = document.querySelector(".container")

export const EntryFilters = () => {
    return `
        <article class="filter">
            <section class="filter__section filter__section--mood">
                <fieldset>
                    <legend>Filter Journal Entries by Mood</legend>
                    <input type="radio" name="moodFilter" id="moodFilter--sad" value="sad">
                    <label for="moodFilter--sad">Sad</label>
                    <input type="radio" name="moodFilter" id="moodFilter--happy" value="happy">
                    <label for="moodFilter--happy">Happy</label>
                    <input type="radio" name="moodFilter" id="moodFilter--ok" value="ok">
                    <label for="moodFilter--ok">Ok</label>

                    <button id="clearMood" style="margin-left: 2rem">Clear</button>
                </fieldset>
            </section>
            <section class="filter__section filter__section--search">
                <fieldset>
                    <legend>Search journal entries</legend>
                    <input id="filter__searchTerm" placeholder="Enter search term" type="text">
                </fieldset>
            </section>
        </article>
    `
}

eventHub.addEventListener("click", e => {
    if (e.target.id === "clearMood") {

    }
})

eventHub.addEventListener("change", e => {
    if (e.target.name === "moodFilter") {
        const mood = new CustomEvent("moodSelected", {
            detail: {
                mood: e.target.value
            }
        })
    }
})


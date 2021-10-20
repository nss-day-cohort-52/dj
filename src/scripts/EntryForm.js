import { getJournalEntry, saveJournalEntry, updateJournalEntry } from "./EntryDataProvider.js"
import { findEntryTag, findTag, getEntryTags, getTagsForEntry, saveEntryTag, saveTag, useTags } from "./TagsProvider.js"

const eventHub = document.querySelector(".container")

let entry = {}

export const EntryForm = () => {
    return `
        <h1>Daily Journal</h1>
        <form class="entryForm">
            <fieldset class="fieldset">
                <label for="concepts">Concepts covered</label>
                <input type="text" name="concepts" id="entryForm__concepts" autofocus />
            </fieldset>
            <fieldset class="fieldset">
                <label for="journalEntry">Journal Entry</label>
                <textarea name="journalEntry" id="entryForm__entry"></textarea>
            </fieldset>
            <fieldset class="fieldset">
                <label for="tags">Tags</label>
                <input type="text" name="tags" id="entryForm__tags" />
            </fieldset>
            <fieldset class="fieldset">
                <label for="journalDate">Mood for the day</label>
                <select name="mood" id="entryForm__mood">
                <option value="">--Please choose an option--</option>
                <option value="angry">Angry</option>
                <option value="ok">Ok</option>
                <option value="sad">Sad</option>
                <option value="happy">Happy</option>
                </select>
            </fieldset>
            <input type="hidden" id="entryForm__id" value="" />
        </form>
        <button id="journalSaveButton">Record Journal Entry</button>
    `
}


/*
    Saving/Editing a journal entry on button click
*/
eventHub.addEventListener("click", e => {
    if (e.target.id === "journalSaveButton") {
        const concept = document.querySelector("#entryForm__concepts").value
        const entryText = document.querySelector("#entryForm__entry").value
        const mood = document.querySelector("#entryForm__mood").value
        const id = document.querySelector("#entryForm__id").value
        const tags = document.querySelector("#entryForm__tags").value.split(",")

        if (id !== "") {
            // Construct replacement entry object
            const updatedEntry = {
                id: parseInt(id),
                date: entry.date,
                concept,
                entry: entryText,
                mood
            }


            // Replace old entry state, then create/assign tags to entry (if changed)
            updateJournalEntry(updatedEntry)
                .then(() => {
                    const tagCreationPromises = []
                    tags.forEach(tag => tagCreationPromises.push(addTagsToEntry(updatedEntry, tag)))
                    Promise.all(tagCreationPromises).then(getEntryTags)
                })
        }
        else {
            // Construct new entry object
            const newEntry = {
                date: Date.now(),
                concept,
                entry: entryText,
                mood
            }

            // Create new entry, then create/assign tags to it
            saveJournalEntry(newEntry)
                .then(createdEntry => {
                    const tagCreationPromises = []


                    Promise.all("this should be an array of promises").then(getEntryTags)
                })
        }

    }
})

/*
    Clear the form of all user input
*/
const reset = () => {
    entry = {}
    document.querySelector("#entryForm__concepts").value = ""
    document.querySelector("#entryForm__entry").value = ""
    document.querySelector("#entryForm__mood").value = ""
    document.querySelector("#entryForm__tags").value = ""
    document.querySelector("#entryForm__id").value = ""
}

/*
    Find or create tags, and then assign them to a journal entry
*/
const addTagsToEntry = (entry, tag) => {
    return findTag(tag)
        .then(matches => {
            let matchingTagId = null

            if (matches.length > 0) {
                matchingTagId = matches[0].id
            }

            if (matchingTagId === null) {
                return saveTag(tag)
                    .then(new_tag => {
                        saveEntryTag(entry.id, new_tag.id)
                    })
            }
            else {
                // Does the relationship already exist?
                return findEntryTag(entry.id, matchingTagId)
                    .then(rel => {
                        // Relationship does not exist yet, so create it
                        if (rel.length === 0) {
                            return saveEntryTag(entry.id, matchingTagId)
                        }
                    })
            }
        })
}

/*
    Reset the form when an entry is created, updated, or deleted
*/
eventHub.addEventListener("entryStateChanged", reset)


/*
    User chose to edit an entry. Populate the form fields with current API state.
*/
eventHub.addEventListener("editInitiated", e => {
    const allTags = useTags()
    getJournalEntry(e.detail.entryId)
        .then(foundEntry => {
            entry = foundEntry
            return getTagsForEntry(entry.id)
        })
        .then(relationships => {
            entry.tags = relationships
                .map(rel => allTags.find(tag => tag.id == rel.tagId))
                .map(tag => tag.subject)

            document.querySelector("#entryForm__concepts").value = entry.concept
            document.querySelector("#entryForm__entry").value = entry.entry
            document.querySelector("#entryForm__mood").value = entry.mood
            document.querySelector("#entryForm__tags").value = entry.tags.join(",")
            document.querySelector("#entryForm__id").value = entry.id

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            })
        })
})

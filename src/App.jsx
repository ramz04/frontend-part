/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios"
import { useEffect, useState } from "react"
import noteService from "./services/notes"

export default function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }

    noteService.create(noteObject).then((returnedData) => {
      setNotes(notes.concat(returnedData))
      setNewNote("")
    })
  }

  useEffect(() => {
    noteService.getAll().then((initialData) => {
      setNotes(initialData)
    })
  }, [])

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then((returnedData) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedData)))
      })
      .catch((error) => {
        alert(`the note '${note.content}' was already deleted from server`)
        setNotes(notes.filter((n) => n.id !== id))
      })
  }

  return (
    <div>
      <div>
        <h1>Notes</h1>
        <div>
          <button onClick={() => setShowAll(!showAll)}>
            show {showAll ? "important" : "all"}
          </button>
        </div>
        <ul>
          {notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

const Note = ({ note, toggleImportance }) => {
  const label = note.important ? "make not important" : "make important"

  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

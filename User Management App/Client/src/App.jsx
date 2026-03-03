import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const API = "http://localhost:3000"

export default function App() {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({
    name: '', email: '', department: '', role: '', password: ''
  })
  const [editId, setEditId] = useState(null)

  const fetchEmployees = async () => {
    const res = await axios.get(`${API}/employees`)
    setEmployees(res.data)
  }

  useEffect(() => { fetchEmployees() }, [])

  const submit = async e => {
    e.preventDefault()
    editId
      ? await axios.put(`${API}/update/${editId}`, form)
      : await axios.post(`${API}/add`, form)

    setForm({ name:'', email:'', department:'', role:'', password:'' })
    setEditId(null)
    fetchEmployees()
  }

  return (
    <main className="canvas">
      <section className="card">
        <header className="hero">
          <h1>Employee Archive</h1>
          <p>Curated workforce registry</p>
        </header>

        <form className="lux-form" onSubmit={submit}>
          <input placeholder="Name" name="name" value={form.name}
            onChange={e=>setForm({...form,name:e.target.value})} />
          <input placeholder="Email" name="email" value={form.email}
            onChange={e=>setForm({...form,email:e.target.value})} />
          <input placeholder="Department" name="department" value={form.department}
            onChange={e=>setForm({...form,department:e.target.value})} />
          <input placeholder="Role" name="role" value={form.role}
            onChange={e=>setForm({...form,role:e.target.value})} />

          {!editId &&
            <input type="password" placeholder="Password"
              onChange={e=>setForm({...form,password:e.target.value})} />
          }

          <button>{editId ? 'Update Entry' : 'Add to Archive'}</button>
        </form>

        <div className="list">
          {employees.map(emp => (
            <article key={emp._id} className="emp-card">
              <div>
                <h3>{emp.name}</h3>
                <span>{emp.role}</span>
              </div>

              <div className="meta">
                <p>{emp.department}</p>
                <p>{emp.email}</p>
              </div>

              <div className="actions">
                <button onClick={()=>{setEditId(emp._id);setForm(emp)}}>Edit</button>
                <button onClick={()=>axios.delete(`${API}/delete/${emp._id}`).then(fetchEmployees)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

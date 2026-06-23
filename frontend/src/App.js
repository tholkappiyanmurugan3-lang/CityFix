import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  // User Details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Complaint Details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  // Image
  const [image, setImage] = useState(null);

  // Language
  const [language, setLanguage] = useState("en");

  // Complaints
  const [complaints, setComplaints] = useState([]);

  // Translations
  const translations = {

    en: {
      title: "CityFix",
      subtitle: "Smart City Complaint System",
      submit: "Submit Complaint",
      issue: "Issue Title",
      description: "Describe the issue...",
      select: "Select Category",
      location: "Location",
      name: "Your Name",
      phone: "Phone Number",
      resolved: "Mark Resolved",
      pending: "Pending",
      solved: "Resolved",
    },

    ta: {
      title: "சிட்டி ஃபிக்ஸ்",
      subtitle: "ஸ்மார்ட் சிட்டி புகார் அமைப்பு",
      submit: "புகார் சமர்ப்பிக்கவும்",
      issue: "பிரச்சனை தலைப்பு",
      description: "பிரச்சனையை விவரிக்கவும்...",
      select: "வகையை தேர்ந்தெடுக்கவும்",
      location: "இடம்",
      name: "உங்கள் பெயர்",
      phone: "தொலைபேசி எண்",
      resolved: "தீர்ந்ததாக குறிக்கவும்",
      pending: "நிலுவையில்",
      solved: "தீர்க்கப்பட்டது",
    },

  };

  const t = translations[language];

  // Fetch Complaints
  const fetchComplaints = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/getComplaints"
      );

      setComplaints(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchComplaints();

  }, []);

  // Get GPS
  const getLocation = () => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setLocation(
          `Lat: ${lat}, Lon: ${lon}`
        );

      },

      () => {

        alert("Location access denied");

      }

    );

  };

  // Submit Complaint
  const handleSubmit = async () => {

    if (
      !name ||
      !phone ||
      !title ||
      !description ||
      !category
    ) {

      alert("Please fill all fields");
      return;

    }

    const complaintId =
      "CF" + Math.floor(Math.random() * 100000);

    const newComplaint = {

      complaintId,
      name,
      phone,
      title,
      description,
      category,
      location,
      image,
      status: "Pending",

    };

    try {

      await axios.post(
        "http://localhost:5000/addComplaint",
        newComplaint
      );

      alert(
        `Complaint Submitted 🚧
ID: ${complaintId}`
      );

      fetchComplaints();

      setName("");
      setPhone("");
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setImage(null);

    } catch (error) {

      console.log(error);

      alert("Error saving complaint");

    }

  };

  // Resolve Complaint
  const markResolved = (index) => {

    const updatedComplaints = [...complaints];

    updatedComplaints[index].status = "Resolved";

    setComplaints(updatedComplaints);

  };

  return (

    <div style={styles.pageBackground}>

      <div style={styles.mobileFrame}>

        {/* Mobile Top Bar */}
        <div style={styles.topBar}></div>

        {/* Header */}
        <div style={styles.header}>

          <div style={styles.titleRow}>

            <div>

              <h1 style={styles.title}>
                🚧 {t.title}
              </h1>

              <p style={styles.subtitle}>
                {t.subtitle}
              </p>

            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={styles.languageSelect}
            >
              <option value="en">EN</option>
              <option value="ta">தமிழ்</option>
            </select>

          </div>

        </div>

        {/* Form */}
        <div style={styles.form}>

          <input
            type="text"
            placeholder={t.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder={t.phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder={t.issue}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder={t.description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.input}
          >

            <option value="">
              {t.select}
            </option>

            <option value="Road">Road</option>
            <option value="Streetlight">Streetlight</option>
            <option value="Garbage">Garbage</option>
            <option value="Water">Water Supply</option>

          </select>

          <button
            onClick={getLocation}
            style={styles.locationButton}
          >
            📍 Get Location
          </button>

          {location && (

            <p style={styles.locationText}>
              {location}
            </p>

          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(
                URL.createObjectURL(
                  e.target.files[0]
                )
              )
            }
            style={styles.fileInput}
          />

          <button
            onClick={handleSubmit}
            style={styles.button}
          >
            {t.submit}
          </button>

        </div>

        {/* Complaints */}
        <div style={styles.complaintSection}>

          {complaints.map((item, index) => (

            <div key={index} style={styles.card}>

              {item.image && (

                <img
                  src={item.image}
                  alt="issue"
                  style={styles.image}
                />

              )}

              <h3>{item.title}</h3>

              <p>
                <strong>ID:</strong> {item.complaintId}
              </p>

              <p>
                <strong>Name:</strong> {item.name}
              </p>

              <p>
                <strong>Phone:</strong> {item.phone}
              </p>

              <p>{item.description}</p>

              <p>
                <strong>📍</strong> {item.location}
              </p>

              <span style={styles.category}>
                {item.category}
              </span>

              <p style={styles.statusText}>

                <strong>

                  {item.status === "Pending"
                    ? `🟡 ${t.pending}`
                    : `🟢 ${t.solved}`}

                </strong>

              </p>

              <button
                onClick={() => markResolved(index)}
                style={styles.resolveButton}
              >
                {t.resolved}
              </button>

            </div>

          ))}

        </div>

        {/* Bottom Navigation */}
        <div style={styles.bottomNav}>

          <div style={styles.navItem}>
            🏠
          </div>

          <div style={styles.addButton}>
            ➕
          </div>

          <div style={styles.navItem}>
            👤
          </div>

        </div>

      </div>

    </div>

  );
}

const styles = {

  pageBackground: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #141e30, #243b55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
  },

  mobileFrame: {
    width: "390px",
    height: "820px",
    backgroundColor: "#0f172a",
    borderRadius: "45px",
    border: "8px solid black",
    overflowY: "auto",
    padding: "20px",
    position: "relative",
    boxShadow: "0 0 40px rgba(0,0,0,0.5)",
  },

  topBar: {
    width: "120px",
    height: "25px",
    backgroundColor: "black",
    borderRadius: "20px",
    position: "absolute",
    top: "10px",
    left: "50%",
    transform: "translateX(-50%)",
  },

  header: {
    marginTop: "40px",
    marginBottom: "20px",
  },

  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: "34px",
    margin: 0,
  },

  subtitle: {
    color: "#cbd5e1",
    marginTop: "5px",
    fontSize: "13px",
  },

  languageSelect: {
    padding: "8px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },

  form: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
  },

  textarea: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    height: "100px",
    resize: "none",
    fontSize: "15px",
    outline: "none",
  },

  fileInput: {
    fontSize: "14px",
  },

  button: {
    padding: "15px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(to right, #ff512f, #dd2476)",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  locationButton: {
    padding: "12px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  locationText: {
    fontSize: "12px",
    color: "#111827",
  },

  complaintSection: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "80px",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "22px",
    padding: "18px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },

  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "15px",
    marginBottom: "10px",
  },

  category: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
  },

  statusText: {
    marginTop: "10px",
  },

  resolveButton: {
    marginTop: "12px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(to right, #11998e, #38ef7d)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  bottomNav: {
    position: "fixed",
    bottom: "25px",
    width: "320px",
    backgroundColor: "#111827",
    padding: "15px",
    borderRadius: "25px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    fontSize: "24px",
    color: "white",
    cursor: "pointer",
  },

  addButton: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background:
      "linear-gradient(to right, #ff512f, #dd2476)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontSize: "30px",
    marginTop: "-35px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    cursor: "pointer",
  },

};

export default App;
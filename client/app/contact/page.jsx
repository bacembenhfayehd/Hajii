"use client"

import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    }, 3000)
  }

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Email",
      content: "contact@hajicosmetiques.tn",
      description: "Disponible de 8h à 20h, 7j/7",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: "Téléphone / WhatsApp",
      content: "+216 58021530",
      description: "Disponible de 8h à 20h, 7j/7",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: " Adresse de la boutique ",
      content: " Rue Fadhel Ben Achour, Centre-ville, Mareth – Gabès",
      description: " Rue Jamel Abd Nasser, Centre-ville, Mareth – Gabès",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      title: "Chat",
      content: "Disponible sur notre plateforme",
      description: "",
    },
  ]

  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0fdf4 0%, #f0fdf9 50%, #f8fafc 100%)",
    fontFamily: "system-ui, -apple-system, sans-serif",
  }

  const heroStyle = {
    position: "relative",
    padding: "6rem 1rem",
    textAlign: "center",
    animation: "fadeIn 0.8s ease-out",
  }

  const titleStyle = {
    fontSize: "clamp(3rem, 8vw, 5rem)",
    fontFamily: "Georgia, serif",
    color: "#1f2937",
    marginBottom: "1.5rem",
    lineHeight: "1.1",
  }

  const subtitleStyle = {
    display: "block",
    color: "#008000",
    fontStyle: "italic",
  }

  const descriptionStyle = {
    fontSize: "1.25rem",
    color: "#6b7280",
    maxWidth: "32rem",
    margin: "0 auto",
    lineHeight: "1.6",
  }

  const containerStyle = {
    maxWidth: "80rem",
    margin: "0 auto",
    padding: "0 1rem 4rem",
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "4rem",
    alignItems: "start",
  }

  const contactInfoStyle = {
    animation: "fadeIn 0.8s ease-out 0.2s both",
  }

  const sectionTitleStyle = {
    fontSize: "2rem",
    fontFamily: "Georgia, serif",
    color: "#1f2937",
    marginBottom: "1rem",
  }

  const sectionDescStyle = {
    fontSize: "1.125rem",
    color: "#6b7280",
    lineHeight: "1.6",
  }

  const contactMethodStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    padding: "1.5rem",
    background: "rgba(255, 255, 255, 0.7)",
    borderRadius: "1rem",
    transition: "all 0.3s ease",
    cursor: "pointer",
    border: "1px solid rgba(5, 150, 105, 0.1)",
  }

  const iconContainerStyle = {
    flexShrink: 0,
    width: "3rem",
    height: "3rem",
    background: "#008000",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  }

  const formContainerStyle = {
    background: "rgba(255, 255, 255, 0.9)",
    padding: "2rem",
    borderRadius: "1rem",
    border: "1px solid rgba(5, 150, 105, 0.1)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    animation: "fadeIn 0.8s ease-out 0.4s both",
  }

  const formTitleStyle = {
    fontSize: "2rem",
    fontFamily: "Georgia, serif",
    color: "#1f2937",
    marginBottom: "1.5rem",
  }

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  }

  const inputGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  }

  const labelStyle = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: "0.5rem",
  }

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "2px solid #e5e7eb",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    outline: "none",
  }

  const textareaStyle = {
    ...inputStyle,
    resize: "vertical",
    minHeight: "120px",
  }

  const selectStyle = {
    ...inputStyle,
    background: "white",
  }

  const buttonStyle = {
    width: "100%",
    padding: "1rem",
    background: isSubmitting ? "#9ca3af" : "#059669",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: isSubmitting ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  }

  const successStyle = {
    background: "rgba(255, 255, 255, 0.9)",
    padding: "2rem",
    borderRadius: "1rem",
    textAlign: "center",
    border: "1px solid rgba(5, 150, 105, 0.2)",
    animation: "fadeIn 0.5s ease-out",
  }

  const successIconStyle = {
    width: "4rem",
    height: "4rem",
    background: "#059669",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
  }

  const faqStyle = {
    marginTop: "3rem",
    padding: "1.5rem",
    background: "rgba(255, 255, 255, 0.5)",
    borderRadius: "1rem",
    border: "1px solid rgba(5, 150, 105, 0.1)",
  }

  const faqTitleStyle = {
    fontSize: "1.25rem",
    fontFamily: "Georgia, serif",
    color: "#1f2937",
    marginBottom: "1rem",
  }

  return (
    <>
      <div style={pageStyle}>
        {/* Hero Section */}
        <section style={heroStyle}>
          <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
            <h1 style={titleStyle}>
              Contactez
              <span style={subtitleStyle}>Haji cosmétiques</span>
            </h1>
            <p style={descriptionStyle}>
              Nous sommes là pour vous aider à trouver votre routine beauté idéale.
               N'hésitez pas à nous contacter pour obtenir des recommandations personnalisées ou pour toute question.
            </p>
          </div>

          {/* Decorative line */}
          <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "6rem", height: "1px", background: "#059669" }}></div>
          </div>
        </section>

        <div style={containerStyle}>
          <div style={gridStyle}>
            {/* Contact Info */}
            <div style={contactInfoStyle}>
              <div style={{ marginBottom: "3rem" }}>
                <h2 style={sectionTitleStyle}>Créons ensemble votre look idéal</h2>
                <p style={sectionDescStyle}>
                  Nous somme là pour vous guider dans votre parcours de soins de la peau et de maquillage.
                  Que vous ayez besoin de recommandations sur les produits ou que vous ayez des questions sur votre routine,
                il vous suffit de nous envoyer un message.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {contactMethods.map((method, index) => (
                  <div
                    key={index}
                    style={contactMethodStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)"
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.7)"
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    <div style={iconContainerStyle}>{method.icon}</div>
                    <div>
                      <h3 style={{ fontWeight: "600", color: "#1f2937", marginBottom: "0.25rem" }}>{method.title}</h3>
                      <p style={{ color: "#1f2937", fontWeight: "500", marginBottom: "0.25rem" }}>{method.content}</p>
                      <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Section */}
              <div style={faqStyle}>
                <h3 style={faqTitleStyle}>FAQ</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
                  <div>
                    <p style={{ fontWeight: "500", color: "#1f2937" }}>Proposez-vous des consultations virtuelles ?</p>
                    <p style={{ color: "#6b7280" }}>Oui ! Réservez une séance de 30 minutes.</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: "500", color: "#1f2937" }}>Quelle est votre politique de retour ?</p>
                    <p style={{ color: "#6b7280" }}>Retours sous 30 jours pour les produits non ouverts, sous 14 jours pour les produits ouverts.</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: "500", color: "#1f2937" }}>Livrez-vous à l'international ?</p>
                    <p style={{ color: "#6b7280" }}>Nous livrons actuellement juste en tunisie</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {submitted ? (
                <div style={successStyle}>
                  <div style={successIconStyle}>
                    <svg
                      style={{ width: "2rem", height: "2rem", color: "white" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontFamily: "Georgia, serif",
                      color: "#1f2937",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Merci !
                  </h3>
                  <p style={{ color: "#6b7280" }}>Nous vous répondrons dans les 24 heures.</p>
                </div>
              ) : (
                <div style={formContainerStyle}>
                  <h2 style={formTitleStyle}>Envoyez-nous un message</h2>

                  <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={inputGridStyle}>
                      <div>
                        <label htmlFor="firstName" style={labelStyle}>
                          Prénom *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = "#059669")}
                          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" style={labelStyle}>
                          Nom *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = "#059669")}
                          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" style={labelStyle}>
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "#059669")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" style={labelStyle}>
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+216 XXXXXXXX"
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = "#059669")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" style={labelStyle}>
                        Sujet *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        style={selectStyle}
                        onFocus={(e) => (e.target.style.borderColor = "#059669")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                      >
                        <option value="">Choisir un sujet</option>
                        <option value="product-inquiry">Renseignements sur les produits</option>
                        <option value="skincare-consultation">Assistance pour les commandes </option>
    
                        <option value="partnership">Opportunité de partenariat</option>
                        <option value="other">Autres</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" style={labelStyle}>
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Dites-nous comment nous pouvons vous aider..."
                        style={textareaStyle}
                        onFocus={(e) => (e.target.style.borderColor = "#059669")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={buttonStyle}
                      onMouseEnter={(e) => {
                        if (!isSubmitting) {
                          e.target.style.background = "#008000"
                          e.target.style.transform = "translateY(-1px)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSubmitting) {
                          e.target.style.background = "#008000"
                          e.target.style.transform = "translateY(0)"
                        }
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            style={{
                              animation: "spin 1s linear infinite",
                              width: "1.25rem",
                              height: "1.25rem",
                            }}
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              style={{ opacity: 0.25 }}
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              style={{ opacity: 0.75 }}
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Envoi...
                        </>
                      ) : (
                        "Envoyer"
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div
          style={{
            position: "fixed",
            top: "5rem",
            right: "2.5rem",
            width: "8rem",
            height: "8rem",
            background: "rgba(5, 150, 105, 0.1)",
            borderRadius: "50%",
            filter: "blur(3rem)",
            animation: "float 6s ease-in-out infinite",
            zIndex: -1,
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: "5rem",
            left: "2.5rem",
            width: "6rem",
            height: "6rem",
            background: "rgba(16, 185, 129, 0.2)",
            borderRadius: "50%",
            filter: "blur(2rem)",
            animation: "float 6s ease-in-out infinite 2s",
            zIndex: -1,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}

import React, { useState } from 'react'
import moment from "moment"

const Footer = () => {
  const [year, setYear] = useState(new Date())
  return (
    <div className="footer">
        <p>&copy; {moment(year).format("YYYY")} Académie FC Plateau Tamba. All rigths reserved.</p>
    </div>
  )
}

export default Footer
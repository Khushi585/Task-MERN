import moment from 'moment'
import React from 'react'

const DateFormat = (date) => {
    return moment(date).format("Do MMMM YY")
}

export default DateFormat

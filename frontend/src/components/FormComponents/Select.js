import React from 'react'
import Form from 'react-bootstrap/Form';

const Select = ({ list, title, set, selected }) => {
    return <Form.Select aria-label="Default select example" value={selected} onChange={(e) => {
        set(e.target.value)
    }} >
        <option disabled>{title}</option>
        {list.map((item) => {
            return <option key={item.value} value={item.value} > {item.label}</option>
        })}
    </Form.Select>
}

export default Select;
import mongoose from 'mongoose'
import tableSchema from '../database/schema/table_schema.js'

const Table = mongoose.model('Table', tableSchema)

export default Table

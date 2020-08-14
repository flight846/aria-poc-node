const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const caseSchema = new mongoose.Schema(
    {
        caseId: {
            type: String,
            required: [true, 'A case must have an id'],
            unique: true,
            maxlength: [
                20,
                'A case id must not be longer than 20 characters',
            ],
            minlength: [
                4,
                'A case id must not be shorter than 4 characters',
            ],
            // validate: [validator.isAlpha, 'Case name must only contain characters']
        },
        charge: {
            description: {
                type: String,
                required: true
            },
            codes: [String],
            concurrentOrSerial: {
                type: String,
                required: true
            }
        },
        court: {
            type: String,
            required: true,
        },
        judge: {
            type: String,
            required: true,
        },
        year: {
            type: Date,
            required: true,
        },
        sentence: {
            type: Number,
            required: true,
        },
        slug: String,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// DOCUMENT MIDDLEWARE: Runs before .save() and .create() only
caseSchema.pre('save', function(next) {
    this.slug = slugify(this.caseId, { lower: true });
    next();
})

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
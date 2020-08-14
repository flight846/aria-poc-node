const Case = require('../models/caseModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );


// cases?from=YYYY&to=YYYY
exports.getCasesBetweenYears = catchAsync(async (req, res, next) => {
    const _case = await Case.find({
        year: {
            $gte: req.query.from,
            $lt: req.query.to,
        },
    });

    res.status(200).json({
        status: 'success',
        results: _case.length,
        data: {
            cases: _case
        },
    });
});

exports.getAllCases = catchAsync(async (req, res, next) => {
    // Execute Query
    const features = new APIFeatures(Case.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const cases = await features.query;

    // Send Query
    res.status(200).json({
        status: 'success',
        results: cases.length,
        data: {
            cases
        }
    });
});

exports.getCase = catchAsync(async (req, res, next) => {
    const _case = await Case.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })

    if (!_case) {
        return next(new AppError('No case found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            case: _case
        },
    });
});

exports.createCase = catchAsync(async (req, res, next) => {
    const newCase = await Case.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tour: newCase,
        },
    });
});

exports.updateCase = catchAsync(async (req, res, next) => {
    const _case = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!_case) {
        return next(new AppError('No case found with that ID', 404));
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            case: _case
        }
    });
});

exports.deleteCase = catchAsync(async (req, res, next) => {
    const _case = await Case.findOneAndDelete(req.params.id);

    if (!_case) {
        return next(new AppError('No case found with that ID', 404));
    }
    
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getcodes = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

// Aggregation Pipeline below
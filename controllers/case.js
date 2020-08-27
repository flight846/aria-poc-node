const Case = require('../models/caseModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError'); 

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );


// cases?from=YYYY&to=YYYY
exports.getCasesBetweenYears = catchAsync(async (req, res, next) => {
    if (req.query.from && req.query.to) {
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
    } else {
        return next();
    }
});

exports.getAllCases = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Case.find(), req.query)
        // .filter()
        .sort()
        .limitFields()
        .paginate();
    const _cases = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: _cases.length,
        data: {
            _cases,
        },
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

exports.getCasesByCodes = catchAsync(async (req, res, next) => {
    if (req.query.codes) {
        const codes = req.query.codes.split(',');
        const eleMatch = {};
        codes.map(code => {
            const iterator = { $all: code };
            Object.assign(eleMatch, iterator);
        });

        const _case = await Case.find({
            'charge.codes': {
                $elemMatch: eleMatch
            }
        });
        res.status(200).json({
            status: 'success',
            results: _case.length,
            data: {
                cases: _case
            },
        });
    } else {
        return next();
    }
});

// Aggregation Pipeline below
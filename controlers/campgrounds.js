const CampgroundModel = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => { 
    const campgrounds = await CampgroundModel.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createNewCampground = async(req, res) => {
    const campground = new CampgroundModel(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res)=>{
    const { id } = req.params;
    const campground = await CampgroundModel.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'sory, this campground is no exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground});
}

module.exports.renderEditForm = async(req, res)=>{
    const campground = await CampgroundModel.findById(req.params.id);
    if(!campground){
        req.flash('error', 'sory, this campground is no exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async(req, res)=>{
    const campground = await CampgroundModel.findOneAndUpdate({_id: req.params.id},{...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: { filename: { $in: req.body.deleteImages } } } })
    }        

    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async(req, res)=>{
    await CampgroundModel.findOneAndDelete({_id: req.params.id});
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
}
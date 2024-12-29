const { Post } = require('../models');
const fs = require('fs');

// Add a new post
exports.createPost = (req, res, next) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        // Ensure req.body.post exists and is parseable
        if (!req.body.post) {
            return res.status(400).json({ message: 'Post data is required.' });
        }

        const postObject = JSON.parse(req.body.post);

        // Validate required fields in postObject
        if (!postObject.title || !postObject.content) {
            return res.status(400).json({ message: 'Title and content are required.' });
        }

        // Create a new post instance
        const post = new Post({
            ...postObject,
            mediaUrl: req.file
                ? `${req.protocol}://${req.get('host')}/media/${req.file.filename}` // If file exists, set mediaUrl
                : null, // Otherwise, mediaUrl is null
        });

        console.log('Post to be saved:', post);

        // Save the post to the database
        post.save()
            .then(() => res.status(201).json({ message: 'Post created successfully!' }))
            .catch((error) => {
                console.error('Error saving post:', error);
                res.status(500).json({ message: 'Failed to save the post.', error });
            });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal Server Error.', error });
    }
};


// Modify a post
exports.modifyPost = (req, res, next) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        let updatedPost;
        if (req.file) {
            const mediaUrl = `${req.protocol}://${req.get('host')}/media/${req.file.filename}`;
            updatedPost = {
                ...JSON.parse(req.body.post),
                mediaUrl,
            };
        } else {
            updatedPost = { ...JSON.parse(req.body.post) };
        }

        Post.updateOne({ _id: req.params.id }, updatedPost)
            .then(() => res.status(200).json({ message: 'Post updated successfully!' }))
            .catch(error => res.status(400).json({ message: 'Failed to update the post.', error }));
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Internal Server Error.', error });
    }
};

// Delete a post
exports.deletePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found.' });
            }
            if (post.mediaUrl) {
                const filename = post.mediaUrl.split('/media/')[1];
                fs.unlink(`media/${filename}`, () => {
                    Post.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Post deleted!' }))
                        .catch(error => res.status(400).json({ error }));
                });
            } else {
                Post.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Post deleted!' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};

// Get all posts
exports.getAllPosts = (req, res, next) => {
    Post.findAll()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ error }));
};

// Get one post
exports.getOnePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(400).json({ error }));
};

// Handle liking or disliking a post
exports.likePost = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like; // 1 for like, -1 for dislike, 0 for undo

    Post.findOne({ _id: req.params.id })
        .then(post => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found.' });
            }

            if (like === 1) {
                if (!post.usersLiked.includes(userId)) {
                    post.usersLiked.push(userId);
                    post.likes += 1;
                }
            } else if (like === -1) {
                if (!post.usersDisliked.includes(userId)) {
                    post.usersDisliked.push(userId);
                    post.dislikes += 1;
                }
            } else if (like === 0) {
                if (post.usersLiked.includes(userId)) {
                    post.usersLiked = post.usersLiked.filter(user => user !== userId);
                    post.likes -= 1;
                } else if (post.usersDisliked.includes(userId)) {
                    post.usersDisliked = post.usersDisliked.filter(user => user !== userId);
                    post.dislikes -= 1;
                }
            }

            post.save()
                .then(() => res.status(200).json({ message: 'Post updated successfully!' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

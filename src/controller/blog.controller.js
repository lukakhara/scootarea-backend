import * as blogService from "../services/blog.service";
export async function getAllPosts(req, res) {
    const query = req.validatedQuery;
    const result = await blogService.getBlogPosts(query);
    res.status(200).json(result);
}
export async function getPostById(req, res) {
    const { id } = req.validatedParams;
    const post = await blogService.getBlogPostById({ id });
    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
}

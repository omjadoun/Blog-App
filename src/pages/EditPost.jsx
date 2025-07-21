import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import authService from '../appwrite/auth';
import appwriteService from '../appwrite/config';
import { Container, PostForm } from '../components';

function EditPost() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const verifyAndLoad = async () => {
            try {
                // First verify session
                const hasSession = await authService.checkSession();
                if (!hasSession) {
                    navigate('/login');
                    return;
                }

                // Then load post
                const postData = await appwriteService.getPost(slug);
                
                // Verify ownership
                if (!postData || postData.userId !== userData?.$id) {
                    navigate('/');
                    return;
                }

                setPost(postData);
            } catch (error) {
                console.error('EditPost error:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        verifyAndLoad();
    }, [slug, navigate, userData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return post ? (
        <div className="py-8">
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null;
}

export default EditPost;
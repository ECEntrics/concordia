import React, {
  useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  Dimmer, Divider, Feed, Loader,
} from 'semantic-ui-react';
import { FORUM_CONTRACT } from 'concordia-shared/src/constants/contracts/ContractNames';
import { drizzle } from '../../redux/store';
import PostListRow from './PostListRow';
import PaginationComponent, { ITEMS_PER_PAGE } from '../PaginationComponent';
import './styles.css';

const { contracts: { [FORUM_CONTRACT]: { methods: { getPost: { cacheCall: getPostChainData } } } } } = drizzle;

const PostList = (props) => {
  const {
    postIds, numberOfItems, onPageChange, loading, focusOnPost,
  } = props;
  const [pageNumber, setPageNumber] = useState(1);
  const [getPostCallHashes, setGetPostCallHashes] = useState([]);

  useEffect(() => {
    if (!loading) {
      setGetPostCallHashes(
        postIds.map((postId) => ({
          id: postId,
          hash: getPostChainData(postId),
        })),
      );
    }
  }, [loading, postIds]);

  const posts = useMemo(() => {
    if (loading) {
      return null;
    }
    return postIds
      .map((postId, index) => {
        const postHash = getPostCallHashes.find((getPostCallHash) => getPostCallHash.id === postId);

        return (
            <PostListRow
              id={postId}
              postIndex={ITEMS_PER_PAGE * (pageNumber - 1) + index}
              key={postId}
              postCallHash={postHash && postHash.hash}
              loading={postHash === undefined}
              focus={postId === focusOnPost}
            />
        );
      });
  }, [focusOnPost, getPostCallHashes, loading, pageNumber, postIds]);

  const footer = useMemo(() => {
    const handlePageChange = (event, data) => {
      setPageNumber(data.activePage);
      onPageChange(event, data);
    };

    if (numberOfItems <= ITEMS_PER_PAGE) {
      return null;
    }
    return (
        <>
            <Divider />
            <div id="post-list-pagination">
                <PaginationComponent onPageChange={handlePageChange} numberOfItems={numberOfItems} />
            </div>
        </>
    );
  }, [numberOfItems, onPageChange]);

  return (
      <>
          <Dimmer.Dimmable as={Feed} blurring dimmed={loading} id="post-list" size="large">
              <Loader active={loading} />
              {posts}
          </Dimmer.Dimmable>
          {footer}
      </>
  );
};

PostList.propTypes = {
  postIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  loading: PropTypes.bool,
  focusOnPost: PropTypes.number,
};

export default PostList;

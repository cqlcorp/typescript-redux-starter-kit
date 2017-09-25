
import { routes } from 'constants/routes';
import { trackProgress } from 'modules/redux-requests';
import { loadPostRoute } from 'state/posts';

export const routeSagas = {
    [routes.BLOG]: trackProgress(loadPostRoute, routes.BLOG)
}

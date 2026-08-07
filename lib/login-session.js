export async function refreshSessionAndNavigate({ update, router, target }) {
  await update();
  router.push(target);
  router.refresh();
}

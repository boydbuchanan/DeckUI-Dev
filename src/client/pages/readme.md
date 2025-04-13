# Pages

Top Level Client components that act as setting up layout and handling events.

# Data

All Props to pages should only contain CMS types. That data should then be converted or used for each component.

```typescript
export default function Home({
  session,
  categories,
  creators
}: {
  session: SessionData;
  categories: CategoryTile[];
  creators: CreatorCardProps[];
}) {
```
Replace with CMS types

```typescript
export default function Home({
  session,
  categories,
  creators
}: {
  session: SessionData;
  categories: CMS.Category[];
  creators: CMS.User[];
}) {
```

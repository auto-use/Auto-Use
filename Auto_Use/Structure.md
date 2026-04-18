# Structure Notes

- `windows_use` and `macOS_use` should remain structurally similar. This makes it easier to adapt features across platforms.
- Do not import code from `windows_use` into `macOS_use`, or from `macOS_use` into `windows_use`.
- Release binaries must remain platform-specific and separate. Importing cross-platform code into them can create build and runtime problems.
- No code mixing between platform-specific implementations should be allowed.

- Tool definitions should remain in the system prompt. Some OpenRouter models do not reliably support tool definitions in the description.
- Tools also perform significantly better when they are defined in the system prompt rather than only in the schema description.
- Keep this behavior as it is.

- Do not add any provider that does not support web functionality for build or tool features.
- Only add models that either have built-in web capability or can support web access through a provider integration.

using NLog;

namespace SwiftCart.Logging {
    public static class LoggerHelper {
        private static readonly ILogger logger = LogManager.GetCurrentClassLogger();

        public static void LogInfo(string message) => logger.Info(message);
        public static void LogError(string message, Exception? ex = null) => logger.Error(ex, message);
        public static void LogWarning(string message) => logger.Warn(message);
    }
}

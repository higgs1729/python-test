' Launcher for the Data Analysis Exam quiz app (no console window).
' Double-click to start the server (hidden) and open the browser.
' Stop the server with the "Exit" button in the app screen.
Option Explicit
Dim sh, fso, dir, pyw
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = dir

' Locate the real pythonw.exe (skip the WindowsApps store alias).
pyw = FindPythonw(sh, fso)
If pyw = "" Then
  MsgBox "pythonw.exe was not found. Make sure Python is installed and on PATH.", 48, "Launch error"
  WScript.Quit 1
End If

' Start the server with no console window (2nd arg 0 = hidden).
sh.Run """" & pyw & """ """ & dir & "\server.py""", 0, False
' Wait briefly for the server, then open the default browser.
WScript.Sleep 900
sh.Run "http://localhost:8000/", 1, False

' Scan PATH and return the full path to pythonw.exe, or "" if not found.
Function FindPythonw(sh, fso)
  Dim path, parts, i, d, cand
  FindPythonw = ""
  path = sh.ExpandEnvironmentStrings("%PATH%")
  parts = Split(path, ";")
  For i = 0 To UBound(parts)
    d = Trim(parts(i))
    ' WindowsApps entries are store aliases (stubs) -> skip.
    If d <> "" And InStr(LCase(d), "windowsapps") = 0 Then
      cand = fso.BuildPath(d, "pythonw.exe")
      If fso.FileExists(cand) Then
        FindPythonw = cand
        Exit Function
      End If
    End If
  Next
End Function
